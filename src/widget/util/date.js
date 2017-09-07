//1489722617000 -> 2017-3-17 11:50:17
export var parseDate = (timesamp)=>{
  var date = new Date(timesamp)
  return [date.getFullYear(),date.getMonth()+1,date.getDate()].join('-')+
    ' '+[date.getHours(),date.getMinutes(),date.getSeconds()].join(':')
}

var numToStr = num => {
  return num<10?('0'+num):num+''
}

//1489722617000 -> 11:50:17
export var parseTime = (timesamp)=>{
  var date = new Date(timesamp)
  return [numToStr(date.getHours()),numToStr(date.getMinutes())].join(':')
}

export var parseDateStr = (timesamp)=>{
  var date = new Date(timesamp)
  return [date.getFullYear(),numToStr(date.getMonth()+1),numToStr(date.getDate())].join('')+
    ''+[numToStr(date.getHours()),numToStr(date.getMinutes()),numToStr(date.getSeconds())].join('')
}

// 1489722617000 2017-3-17
export var parseDateOnly = (timesamp)=>{
  var date = new Date(timesamp)
  return [numToStr(date.getFullYear()),numToStr(date.getMonth()+1),numToStr(date.getDate())].join('-')
}

// 获取倒计时
// @param end timestamp
export var getCount = (end,start)=>{

  if(!end){
    return {
      hour:0,
      minute:0,
      second:0,
      mini:0
    }
  }

  var hour = 0
  var minute = 0
  var second = 0
  var mini = 0
  var secondUnit = 1000
  var miniteUnit = 60*secondUnit
  var hourUnit = 60*miniteUnit
  var d = end-(start||(+new Date))
  return {
    hour : parseInt(d/hourUnit),
    minute : parseInt(d%hourUnit/miniteUnit),
    second : parseInt(d%miniteUnit/secondUnit),
    mini : parseInt(d%secondUnit/100)
  }
}
