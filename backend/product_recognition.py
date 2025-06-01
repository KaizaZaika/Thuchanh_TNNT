

# In[55]:


#get_ipython().system('pip uninstall opencv-contrib-python -y')
#get_ipython().system('pip uninstall opencv-python -y')
#get_ipython().system('pip install opencv-contrib-python')


# # Imported Libraries and Classes

# In[56]:


# Imported Libraries
import sys
import sqlite3
import json
import psutil
import os
import numpy as np
import cv2
import matplotlib.pyplot as plt
from os import listdir
import warnings
warnings.filterwarnings("ignore")

from utils.visualization import visualize_detections, print_detections, create_model_counter_dict
from utils.matchers import find_matcher_matrix
from utils.bbox_filtering import find_bboxes

# Images Path
scene_folder = './backend/images/scenes/'
model_folder = './backend/images/models/'
video_folder = './backend/images/videos/'
results_folder = './backend/images/results/'
db_path = '../frontend/products.db'
export_file = results_folder + "detected_items.json"
os.makedirs(results_folder, exist_ok=True)
#reloads external modules when they are changed
#get_ipython().run_line_magic('load_ext', 'autoreload')
#get_ipython().run_line_magic('autoreload', '2')
def fetch_product_price(product_name):
    """Fetch the price of a product from the database."""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    query = "SELECT price FROM products WHERE LOWER(name) = LOWER(?)"
    cursor.execute(query, (product_name.strip(),))  # Normalize product name
    result = cursor.fetchone()
    conn.close()
    return result[0] if result else 0  # Return price or 0 if not found


# In[57]:


# Lists with the scenes and models of Step B
valid_extensions = ('.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG')
model_filenames = [f for f in os.listdir(model_folder) if f.lower().endswith(valid_extensions)]
#scene_filenames = ['e4.png']


# Check if scene filenames are provided as command-line arguments
if len(sys.argv) > 1:
    scene_filenames = sys.argv[1:]  # Use filenames passed as arguments
else:
    scene_filenames = ['e4.png']  # Default value if no arguments are provided
# Read images
im_scene_list_original = [cv2.cvtColor(cv2.imread(scene_folder + name), cv2.COLOR_BGR2RGB) for name in scene_filenames]
im_model_list_original = [cv2.cvtColor(cv2.imread(model_folder + name), cv2.COLOR_BGR2RGB) for name in model_filenames]
# Resize scene images to smaller dimensions
"""im_scene_list_original = [
    cv2.resize(im, (im.shape[1] // 2, im.shape[0] // 2), interpolation=cv2.INTER_AREA)
    for im in im_scene_list_original
]
"""
im_scene_list_original = [
    cv2.resize(im, (int(im.shape[1] * 0.8), int(im.shape[0] * 0.8)), interpolation=cv2.INTER_AREA)
    for im in im_scene_list_original
]


# Use OpenCV's built-in SIFT
sift = cv2.SIFT_create()

# In[58]:


im_model_list = []
model_labels = []

for im, label in zip(im_model_list_original, model_filenames):
    aspect = im.shape[0]/im.shape[1]
    #resize model images
    for s in (360,):
        im_resized = cv2.resize(im, (s, int(s*aspect)))
        im_model_list.append(im_resized)
        model_labels.append(label)

    #gaussian blur on original images
    for sigma in (1.5, 3, 5):
        k = int(np.ceil(3*sigma))
        im_model_list.append(cv2.GaussianBlur(im, (2*k+1, 2*k+1), sigma))
        model_labels.append(label)


# In[ ]:


model_names = {}
for name in listdir(model_folder):
    simplified_name = name.rsplit('_', 1)[-1].split('.')[0]
    model_names[name] = simplified_name


# In[59]:


### Initialization of Super Resolution 
train_dict = {1: ['fsrcnn', './backend/weights/FSRCNN-small_x4.pb'],
              2: ['espcn', './backend/weights/ESPCN_x4.pb'],
              3: ['edsr', './backend/weights/EDSR_x4.pb'],
              4: ['lapsrn', './backend/weights/LapSRN_x4.pb']}
nn_used = 4

sr = cv2.dnn_superres.DnnSuperResImpl_create()
sr.readModel(train_dict[nn_used][1])
sr.setModel(train_dict[nn_used][0], 4)

# upsample scene images
#im_scene_list = [sr.upsample(im) for im in im_scene_list_original]
im_scene_list = im_scene_list_original

#save preprocessed images
#new_scene_folder = f"images/results/upscaled_scenes/upscaled_{nn_used}/"
#for im_scene, filename in zip(im_scene_list, scene_filenames):
#    cv2.imwrite(new_scene_folder + filename, cv2.cvtColor(im_scene, cv2.COLOR_RGB2BGR))



# In[60]:


#set the ransac reprojection threshold when computing the homography
homography_kw = dict(match_distance_threshold = 0.88, ransacReprojThreshold = 1.)
peaks_kw = dict(height = 0.3, distance = 0)

#compute matcher matrix
matcher_matrix = find_matcher_matrix(im_scene_list, im_model_list, K=15, peaks_kw=peaks_kw, homography_kw=homography_kw)


# In[ ]:


def export_detections_to_txt(exported_dictionary, scene_name, results_folder):
    """Export detected items to a text file in the specified format."""
    scene_base = os.path.splitext(scene_name)[0]  # Strip .jpg/.png
    output_filename = f"detection_at_{scene_base}.txt"
    output_path = os.path.join(results_folder, output_filename)
    
    with open(output_path, 'w') as f:
        for product, count in exported_dictionary.items():
            f.write(f"{product} {count}\n")
    
    print(f"Detections exported to: {output_path}")


# In[61]:


new_labels = [model_names[l] for l in model_labels]

grand_total = 0  # Initialize grand total for all scenes
detected_items = []  # List to store detected items and their prices

for i in range(len(im_scene_list)):
    scene_name = scene_filenames[i]

    color_threshold = 15
    overlap_threshold = 0.5
    bbox_props = find_bboxes(matcher_matrix[i], new_labels, color_distance_threshold=color_threshold, min_match_threshold=6, bbox_overlap_threshold=overlap_threshold)
    scene_total = 0  # Initialize total price for the scene
    processed_products = set()  # Set to track unique products in this scene

    w, h, dpi = 960, 720, 75
    fig, ax = plt.subplots(figsize=(w/dpi, h/dpi), dpi=dpi)
    
    visualize_detections(im_scene_list[i], bbox_props, annotation_offset=100, ax=ax, draw_invalid_bbox=0)
    fig.suptitle(scene_name)
    fig.tight_layout(pad=0.5)
    output_path = results_folder + f'found_{scene_name}'
    fig.savefig(output_path, dpi=dpi)
    plt.close(fig)
    
    print_detections(bbox_props)
    exported_dictionary = create_model_counter_dict(bbox_props)
    print(f"Export successful: {output_path}")
    export_detections_to_txt(exported_dictionary, scene_name, results_folder)




