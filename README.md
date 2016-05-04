# Thanks to

- [``mgsweet``](https://github.com/mgsweet/Eden-Answer-Improvement) who inspired me to have a try by myself


# Main Features
Make submission output generated on eden more convenient to read and utilize!

- get rid of "|"s in test input
- add line numbers for you

Note: Only txt files are accepted.  
WARNING: The original file will be covered. It is wise to backup in advance.

![before vs after comparison](http://7xrahq.com1.z0.glb.clouddn.com/output-polisher-before-after-comparison.png)


# Precompiled Binaries (not available for the moment)

There are some precompiled binaries ( by using ``enclose`` )

[``Windows-32bit``](?)
``? MB``

[``Windows-64bit``](?)
``? MB``

[``Mac-64bit``](?)
``? MB``

[``Ubuntu-64bit``](?)
``? MB``

You only need to execute it

# Suggestions on running

- on Windows ( suppose the downloader is located in D:\eden\ )  
 **Note: It is highly recommended that you run the executable binaries under an *ASCII-only* path on Windows.**  
\>\> Create a .bat file containing
 
~~~
cd /d "D:\eden"
OutputPolisher-Win64.exe
pause
~~~
save it as ``run.bat`` and double click to run

- on Mac ( suppose the downloader is located in /Users/$USER/Downloads/ )  
\>\> Create a .sh file containing

~~~
cd "/Users/$USER/Downloads"
./OutputPolisher-Mac64
~~~
save it as ``run.sh``, use ``sudo chmod +x ./run.sh`` and have it run on terminal (double click to run is possible as well)  

- on Ubuntu ( suppose the downloader is located in /home/$USER/Downloads/ )  
\>\> Create a .sh file containing

~~~
cd "/home/$USER/Downloads"
gnome-terminal -x bash -c "./OutputPolisher-Ubuntu64; printf 'Please press Enter to continue'; read"
~~~
save it as ``run.sh``, use ``sudo chmod +x ./run.sh`` and have it run on terminal (double click to run is possible as well)  

# Run Source Code on node.js

[``node.js``](https://nodejs.org/en/) is required.

~~~
node op.js
~~~

## Install node.js on Windows

[``download nodejs v5.10.1 for windows``](https://nodejs.org/dist/v5.10.1/node-v5.10.1-x64.msi)

## Install node.js on Ubuntu

~~~
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install nodejs
~~~

# Details (not available for the moment)
