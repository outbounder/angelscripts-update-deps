var exec = require("child_process").exec
var path = require("path")
var async = require("async")

module.exports = function(angel) {

  angel.confirm = function(text, callback){
    var confirmationAnswers = ["y", "Y"]
    console.info(text, "["+confirmationAnswers+"]")
    process.stdin.resume()
    process.stdin.on("data", function(chunk){
      process.stdin.end()
      if(confirmationAnswers.indexOf(chunk.toString().toLowerCase()) != -1)
        callback(true)
      else
        callback(false)
    })
  }

  angel.exec = function(cwd, command, pipeOutput, next) {
    if(typeof pipeOutput == "function") {
      next = pipeOutput
      pipeOutput = false
    }

    var outputBuffer = ""
    var child = exec(command, { cwd: cwd })
    child.stdout.on('data', function(chunk){
      outputBuffer += chunk.toString()
    })

    if(pipeOutput) {
      if(child.stdout)
        child.stdout.pipe(process.stdout)
      if(child.stderr)
        child.stderr.pipe(process.stderr)
    }

    child.on("exit", function(code){
      next(code != 0?new Error(command+" failed with "+code):null, outputBuffer)
    })
  }

  angel.on("update deps", function(){
    angel.exec(process.cwd(), "npm outdated --depth 0 --json", function(err, stdout){
      if(err) return console.error(err)
      if(stdout) {
        var packagejson = require(path.join(process.cwd(), "package.json"))

        var outdated = JSON.parse(stdout)
        var forInstall = []
        for(var key in outdated) {
          var devDep = packagejson.dependencies[key]?"":"devDep"
          if(outdated[key].current != outdated[key].wanted) {
            forInstall.push({name: key, version: outdated[key].wanted})
            console.info("not wanted, will update ", outdated[key].wanted, " ", key, devDep)
          }
          if(outdated[key].wanted != outdated[key].latest) {
            forInstall.push({name: key, version: outdated[key].latest})
            console.info("not latest, will update ", outdated[key].latest, " ", key, devDep)
          }
        }
        angel.confirm("do you accept?", function(confirmed){
          if(!confirmed) return console.info("ok, nothing is touched.")
          async.eachSeries(forInstall, function(p, next){
            var saveFlag = packagejson.dependencies[p.name]?" --save":" --save-dev"
            angel.exec(process.cwd(), "npm install "+p.name+"@"+p.version+saveFlag, true, next)
          }, function(err){
            if(err) return console.error(err)
            console.log("updating "+forInstall.length+" dep(s) done.")
          })
        })
      } else
        console.info("nothing to update, everything is latest")
    })
  })
}