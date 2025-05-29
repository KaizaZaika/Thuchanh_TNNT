
# coding: utf-8

# # Product Recognition on Store Shelves
# ### Introduction:
# Object detection techniques based on computer vision can be deployed in super market scenarios for the
# creation of a system capable of recognizing products on store shelves. 
# Given the image of a store shelf, such a system should be able identify the different products present 
# therein and may be deployed, e.g. to help visually impaired costumers or to automate some common store
# management tasks (e.g. detect low in stock or misplaced products).
# 
# ### Overall Task:
# Develop a computer vision system that, given a reference image for each product, is able to identify boxes 
# of cereals of different brands from one picture of a store shelf. For each type of product displayed in the 
# shelf the system should report:
# 
# 1. Number of instances.
# 2. Dimension of each instance (width and height of the bounding box that enclose them in pixel).
# 3. Position in the image reference system of each instance (center of the bounding box that enclose 
# them in pixel).

# In[55]:


#get_ipython().system('pip uninstall opencv-contrib-python -y')
#get_ipython().system('pip uninstall opencv-python -y')
#get_ipython().system('pip install opencv-contrib-python')


# # Imported Libraries and Classes

# In[56]:


# Imported Libraries
import sys
import psutil
import os
import numpy as np
import cv2
import matplotlib.pyplot as plt
from os import listdir
import warnings
warnings.filterwarnings("ignore")

from utils.visualization import visualize_detections, print_detections
from utils.matchers import find_matcher_matrix
from utils.bbox_filtering import find_bboxes

# Images Path
scene_folder = './images/scenes/'
model_folder = './images/models/'
video_folder = './images/videos/'
results_folder = './images/results/'
os.makedirs(results_folder, exist_ok=True)
#reloads external modules when they are changed
#get_ipython().run_line_magic('load_ext', 'autoreload')
#get_ipython().run_line_magic('autoreload', '2')


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
train_dict = {1: ['fsrcnn', './weights/FSRCNN-small_x4.pb'],
              2: ['espcn', './weights/ESPCN_x4.pb'],
              3: ['edsr', './weights/EDSR_x4.pb'],
              4: ['lapsrn', './weights/LapSRN_x4.pb']}
nn_used = 4

sr = cv2.dnn_superres.DnnSuperResImpl_create()
sr.readModel(train_dict[nn_used][1])
sr.setModel(train_dict[nn_used][0], 4)

# upsample scene images
im_scene_list = [sr.upsample(im) for im in im_scene_list_original]
#im_scene_list = im_scene_list_original

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





# In[61]:


new_labels = [model_names[l] for l in model_labels]

for i in range(len(im_scene_list)):
    scene_name = scene_filenames[i]

    color_threshold = 15
    overlap_threshold = 0.5
    bbox_props = find_bboxes(matcher_matrix[i], new_labels, color_distance_threshold=color_threshold, min_match_threshold=6, bbox_overlap_threshold=overlap_threshold)

    w, h, dpi = 960, 720, 75
    fig, ax = plt.subplots(figsize=(w/dpi, h/dpi), dpi=dpi)
    
    visualize_detections(im_scene_list[i], bbox_props, annotation_offset=100, ax=ax, draw_invalid_bbox=(0))
    fig.suptitle(scene_name)
    fig.tight_layout(pad=0.5)
    #fig.savefig('images/results/found_' + scene_name)
    #plt.show()
    output_path = results_folder + f'found_{scene_name}'
    fig.savefig(output_path, dpi=dpi)
    plt.close(fig)
    
    print_detections(bbox_props)
    print(f"Export successful: {output_path}")


# In[62]:


#print("bbox_props:", bbox_props)


# In[ ]:


print(f"Memory usage: {psutil.virtual_memory().percent}%")

