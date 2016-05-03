var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var prompt = require('prompt');
var getDirName = path.dirname;
var windows = false;

function readDataFrom(filename, callback) {
  fs.stat(filename, function(err, stat) {
    if (err) {
      if (callback) callback(err, filename, null);
      else throw err;
    } else {
      fs.readFile(filename, 'utf-8', function(err, rawData) {
        if (err) callback(err);
        else {
          callback(undefined, filename, rawData);
        }
      });
    }
  });
};


function writeFile(path, contents, callback) {
  mkdirp(getDirName(path), function(err) {
    if (err) throw err;
    if (windows) contents = contents.replace(/\n/g, '\r\n');
    fs.writeFile(path, contents, function(err) {
      if (err) throw err;
      else if (callback) callback();
    });
  });
}


function polishSubmissionOutput(rawData) {
  var splitData = rawData.split('\n'), polishedData = '';
    // flags we need in full marks judgment mode
  // var toJudge = false, fullmark = true;
  // var beforeGoogleStyle = true, beforeStandard = true, beforeMemory = true;
  var afterExecRandom = false;

    // flags for borders and substring's startindex
    // border: +-------------
  var isBorder = false, borderToEncounter = 0;
  var start = 0;

    // flags we need in input polish mode
  var toPolishInput = false, isTestInput = false;

    // flags we need in linenum addition mode
                          // isYSOutput: is Your 
  var toAddLinenum = false, isYSOutput = false;
  var linenum = 0;

    // deal with data line by line
  for (i in splitData) {

      // if the line starts with '     Your program's stdout output:' or '     Standard answer's stdout output:'
      //    and we are out of linenum addition mode
    if (!toAddLinenum && afterExecRandom && splitData[i].match(/^((     Y)|(     S))/)) {
        // enter polish linenum addition mode
      toAddLinenum = true, isYSOutput = true;
      borderToEncounter = 2, linenum = 1;
    }
      // access linenum addition mode
    if (toAddLinenum) {
      isBorder = splitData[i].match(/^    \+--/);
        // if the line is a border
      if (isBorder) --borderToEncounter, isYSOutput = false;
      var nonContent = isBorder || isYSOutput;
                          // if the line is output content => generate linenum for it
                          // else => no linenum generated
      var linenumString = ((nonContent) ? '' : ('00' + (linenum++)).slice(-3));
      var start = ((nonContent) ? 0 : 3);
                        // if the line is non-content => start from index #0
                        // else the line must contain output content => start from index #3
      polishedData += (linenumString + splitData[i].substring(start) + '\n');

        // if we have encountered two borders, namely no more borders to encounter
        //   => quit linenum addition mode
      if (!borderToEncounter) toAddLinenum = false;
      continue;
    }

/* --------- demo ----------
first we explain how to get formatted linenum with ('00' + (linenum++)).slice(-3)
It's a pity that I failed to find a printf-like function in nodejs that supports %0*d
so I found a workaround:
  if linenum is a one-digit number, say 5, ('00' + (linenum++)) would be '005'
~~~~~~~~~~~~~~~
(-3)(-2)(-1)
 0   0   5
~~~~~~~~~~~~~~~
   *** we start from index #-3 and obtain '005' as a result


  if linenum is a two-digit number, say 43, ('00' + (linenum++)) would be '0043'
~~~~~~~~~~~~~~~
(-4)(-3)(-2)(-1)
 0   0   4   3
~~~~~~~~~~~~~~~
   *** we start from index #-3 and obtain '043' as a result


Now we show how we cope with the data below:
0123456
     Your program's stdout output:
0123456
    +---------------------------------------------------------------------
0123456
    |{}
0123456
    |is empty set: 0
0123456
    |append: 1
0123456
    |append: 1
0123456
    |{-3202, 3054}
0123456
    |append: 0
0123456
    |{-3202, 3054}
0123456
    |is empty set: 0
0123456
    |remove: 1
0123456
    |{3054, 4001, 4794, 5985}
0123456
    |remove: 0
0123456
    |{3054, 4001, 4794, 5985}
0123456
    |
0123456
    +---------------------------------------------------------------------
0123456


Case 1: If the line is non-content (Your output, Standard output, or borders +----...)
~~~~~~~~~~~~~~~~~~~~
0123456
     Your program's stdout output:
0123456
~~~~~~~~~~~~~~~~~~~~

   *** we keep the line intact by starting from index #0 and obtain before appending '\n'
   0123456
>>>     Your program's stdout output:<<<
   0123456

=>
     Your program's stdout output:\n


Case 2: If the line contains output data (the linenum for the line below is 2)
~~~~~~~~~~~~~~~~~~~~
0123456
    |is empty set: 0
0123456
~~~~~~~~~~~~~~~~~~~~

   *** we start from index #3 and obtain before prefixing '002' and appending '\n'
0123456
>>> |is empty set: 0<<<
0123456

=>'002' + ' |is empty set: 0' + '\n'
=>
002 |is empty set: 0\n


In this way we obtain as a result:
     Your program's stdout output:
    +---------------------------------------------------------------------
001 |{}
002 |is empty set: 0
003 |append: 1
004 |append: 1
005 |{-3202, 3054}
006 |append: 0
007 |{-3202, 3054}
008 |is empty set: 0
009 |remove: 1
010 |{3054, 4001, 4794, 5985}
011 |remove: 0
012 |{3054, 4001, 4794, 5985}
013 |
    +---------------------------------------------------------------------


*/

      // if the line starts with '     [Test input]'    (=> is actually [Test input])
      //    and we are out of input polish mode
    if (!toPolishInput && splitData[i].match(/^     \[T/)) {
        // enter polish test input mode
      toPolishInput = true, isTestInput = true;
      borderToEncounter = 2, start = 5;
    }
      // access input polish mode
    if (toPolishInput) {
      isBorder = splitData[i].match(/^    \+/);
        // if the line is a border
      if (isBorder) --borderToEncounter, isTestInput = false;

                      // if the line is a border or [Test input] => start from index #4
                            // else, the line must contain input data => start from index #5
      polishedData += (splitData[i].substring(start - Boolean(isBorder || isTestInput)) + '\n');

  // if we have encountered two borders, namely there are no more borders to encounter
        //   => we have finished polish work in the block above => quit
      if (!borderToEncounter) toPolishInput = false;
      continue;
    }
/* -------- demo ---------
0123456
     [Test input]
0123456
    +---------------------------------------------------------------------
0123456
    |-32131 980 23131 23131 231312
0123456
    |-32 980 28981 89331 3892
0123456
    +---------------------------------------------------------------------
0123456


Case 1: If the line is [Test input]:
~~~~~~~~~~~~~~~~~~~~
0123456
     [Test input]
0123456
~~~~~~~~~~~~~~~~~~~~

   *** we start from index #4 and obtain ' [Test input]' before appending '\n'
0123456
>>>> [Test input]<<<
0123456

=>
 [Test input]\n


Case 2: If the line is a border:
~~~~~~~~~~~~~~~~~~~~
0123456
    +---------------------------------------------------------------------
0123456
~~~~~~~~~~~~~~~~~~~~

   *** we start from index #4 and obtain ' +---------...' before appending '\n'
0123456
>>>>+---------------------------------------------------------------------<<<
0123456

=>
 +---------------------------------------------------------------------\n


Case 3: If the line contains input data:
~~~~~~~~~~~~~~~~~~~~
0123456
    |-32131 980 23131 23131 231312
0123456
~~~~~~~~~~~~~~~~~~~~

   *** we start from index #5 and obtain input data before appending '\n'
0123456
>>>>>-32131 980 23131 23131 231312<<<
0123456

=>
-32131 980 23131 23131 231312\n


In this way we obtain as a result:
 [Test input]
+---------------------------------------------------------------------
-32131 980 23131 23131 231312
-32 980 28981 89331 3892
+---------------------------------------------------------------------

*/
    
    if (!(toPolishInput && toAddLinenum)) polishedData += (splitData[i] + '\n');
    // if (toJudge) {
    //   if (!splitData[i].match(/^Pass/)) fullmark = false;
    //   toJudge = false;
    // }
    // if (beforeMemory) {
      if (!afterExecRandom) {
        // if (beforeStandard) {
        //   if (beforeGoogleStyle) {
            // if (splitData[i].match(/: check_style]/)) {
            //   beforeGoogleStyle = false;
            //   if (fullmark) toJudge = true;
          //   // }
          // }
          // if (splitData[i].match(/: execute_s/)) {
          //   beforeStandard = false;
          //   // if (fullmark) toJudge = true;
          // }
        // }
         if (splitData[i].match(/: execute_r/)) {
           afterExecRandom = true;
           // if (fullmark) toJudge = true;
         }
       }
  //     if (splitData[i].match(/: validate_m/)) {
  //       beforeMemory = false;
  //       if (fullmark) toJudge = true;
  //     }
  //   }
  }
  return polishedData;
}

function start() {
  prompt.start();
  console.log('Please input the filenames');
  console.log('or [simply press Enter] to polish ./output.txt');
  console.log('  *** Note: we only accept .txt files');
  prompt.get([{
    name: 'files',
    type: 'string',
    description: 'files',
    before: function(files) {return files.split(' ');}
  }], function(err, result) {
    if (err) throw err;
    var rawFiles = result.files, count = 0, skip = 0;
      // simply press Enter => fetch unfinished assignments
      console.log('');
    if (rawFiles.length == 1 && rawFiles[0] == '') {
      console.log('Ready to polish "./output.txt"');
      return readDataFrom("./output.txt", function(err, filename, rawData) {
        if (err) {
          console.log('', err.message);
          console.log('Please get ./output.txt ready and try again...');
          start();
        } else {
          writeFile(filename, polishSubmissionOutput(rawData), function(err) {
            if (err) {
              console.log('', err.message);
            } else console.log('   ..."' + filename + '" was polished successfully!');
          });
        }
      });
    }
    for (i in rawFiles) {
      if (skip) {
        --skip;
        continue;
      }
      var oneFile = rawFiles[i], length = oneFile.length;
      while (oneFile[length - 1] == '\\') {
        ++skip;
        console.log(oneFile);
        oneFile = (oneFile.substring(0, length - 1) + ' ' + rawFiles[++i]);
        length = oneFile.length;
      }
      if ((oneFile[0] == "'" || oneFile[0] == '"') && oneFile[0] == oneFile[length - 1])
          oneFile = oneFile.substring(1, length - 1);
      
      if (oneFile.match(/(.txt)$/)) {
          // filename is valid => polish it
        ++count;
        console.log("Ready to polish '" + oneFile + "'");
        readDataFrom(oneFile, function(err, filename, rawData) {
          if (err) {
            console.log('', err.message);
          } else {
            writeFile(filename, polishSubmissionOutput(rawData), function(err) {
              if (err) {
                console.log('', err.message);
              } else console.log('   ..."' + filename + '" was polished successfully!');
            });
          }
        });
      } else if (oneFile != '') {  // else => ignore
        console.log("invalid file '" + oneFile + "' ignored");
      }
    }
      // no valid id input
    if (count == 0) {
      console.log('Bad input! Please try again...');
      return start();
    }
  });
}

(function () {
  console.log('Welcome!');
  start();
})();


