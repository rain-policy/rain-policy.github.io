"use strict";
window.RAIN = {
  title: "Refine Actions If Needed: Adaptive Action Chunk Refinement for Robot Manipulation",
  citation: {bibtex:null},
  authors: [
    {name:"Hanlin Liu", affiliations:[1,2], equalContribution:true},
    {name:"Zichen Zhou", affiliations:[2], equalContribution:true},
    {name:"Jiacheng Zhang", affiliations:[1]},
    {name:"Liuyuan Na", affiliations:[1,3]},
    {name:"Jin Jin", affiliations:[4]},
    {name:"Guangyan Chen", affiliations:[2]},
    {name:"Yufeng Yue", affiliations:[2], corresponding:true},
    {name:"Gen Li", affiliations:[5], corresponding:true},
    {name:"Fangqiang Ding", affiliations:[1], corresponding:true}
  ],
  affiliations: [
    {id:1, name:"The Hong Kong University of Science and Technology (Guangzhou)"},
    {id:2, name:"Beijing Institute of Technology"},
    {id:3, name:"Shanghai Jiao Tong University"},
    {id:4, name:"University of Oxford"},
    {id:5, name:"Nanyang Technological University"}
  ],
  resources: [
    {name:"Paper", symbol:"↗", url:null, detail:"Manuscript", status:"Coming soon"},
    {name:"arXiv", symbol:"↗", url:null, detail:"Preprint", status:"Coming soon"},
    {name:"Code", symbol:"⌘", url:null, detail:"Implementation", status:"Public release pending"},
    {name:"Models", symbol:"↓", url:null, detail:"Pretrained checkpoints", status:"Public release pending"}
  ],
  robotTasks: [
    {id:"cube_stacking", name:"Cube Stacking", description:"Stack the cubes to complete the manipulation task.", results:[65,70,85]},
    {id:"ring_placement", name:"Ring Placement", description:"Place the ring to complete the manipulation task.", results:[50,50,65]},
    {id:"object_sorting", name:"Object Sorting", description:"Sort objects into their target locations.", results:[40,55,70]},
    {id:"pouring", name:"Pouring", description:"Manipulate the container to complete the pouring task.", results:[65,70,70]}
  ],
  robotRows: [ ["ACT",65,50,40,65,55,17.17], ["DP",70,50,55,70,61.25,21.49], ["RAIN",85,65,70,70,72.5,17.57] ],
  simTasks: [
    {id:"pickcube", name:"PickCube", success:100, seed:80014},
    {id:"pushcube", name:"PushCube", success:96, seed:41014},
    {id:"stackcube", name:"StackCube", success:91, seed:42012},
    {id:"peginsertionside", name:"PegInsertionSide", success:59, seed:43037},
    {id:"plugcharger", name:"PlugCharger", success:11, seed:44025},
    {id:"pullcubetool", name:"PullCubeTool", success:89, seed:45022},
    {id:"pusht", name:"PushT", success:24, seed:46038},
    {id:"stackpyramid", name:"StackPyramid", success:63, seed:47033}
  ],
  routingTasks: [
    {id:"peginsertionside", name:"Peg Insertion", description:"Insert the peg into the side opening."},
    {id:"stackcube", name:"Stack Cube", description:"Place one cube on top of the other."},
    {id:"pushcube", name:"Push Cube", description:"Push the cube toward its target."}
  ],
  simRows: [
    ["ACT",98,95,5,7,4,84,3,35,41.375,0.222],
    ["A2A-1",99,50,86,1,0,11,12,3,32.750,0.127],
    ["A2A-4",99,100,90,8,10,31,29,36,50.375,0.206],
    ["A2A-6",100,100,94,27,7,33,29,53,55.375,0.260],
    ["DP-1",0,0,0,0,0,4,0,0,0.500,0.378],
    ["DP-2",100,99,95,40,7,74,21,32,58.500,0.746],
    ["DP-5",100,100,98,48,22,99,20,56,67.875,1.839],
    ["DP-10",100,100,97,56,14,99,15,59,67.500,3.120],
    ["DP-100",100,99,98,55,17,98,21,52,67.500,38.517],
    ["FM-1",100,98,85,12,3,25,16,22,45.125,0.376],
    ["FM-2",100,100,95,32,2,76,17,42,58.000,0.747],
    ["FM-5",100,100,94,42,5,93,17,50,62.625,1.835],
    ["FM-10",100,100,98,44,9,96,15,51,64.125,3.074],
    ["ProbeFlow",100,99,96,37,3,78,16,49,59.750,0.931],
    ["RAIN",100,96,91,59,11,89,24,63,66.625,0.322]
  ],
  controls: [
    ["Fixed 0",46.5,0.158,0.000], ["Fixed 1",65.1,0.278,0.125],
    ["Fixed 2",65.8,0.330,0.251], ["Fixed 3",66.4,0.382,0.376],
    ["Direct-C Calibrated",65.1,0.310,0.265], ["Direct-C Argmax",65.9,0.362,0.335],
    ["RAIN w/o Transition Prior",66.4,0.325,0.288], ["RAIN",66.6,0.322,0.276]
  ]
};
