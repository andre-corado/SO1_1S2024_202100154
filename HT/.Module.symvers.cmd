cmd_/home/ubu/Desktop/GitHub/SO1_1S2024_202100154/HT/Module.symvers := sed 's/\.ko$$/\.o/' /home/ubu/Desktop/GitHub/SO1_1S2024_202100154/HT/modules.order | scripts/mod/modpost -m -a  -o /home/ubu/Desktop/GitHub/SO1_1S2024_202100154/HT/Module.symvers -e -i Module.symvers   -T -