var util = {
  merge: function (def, opt) {
    var obj = def;
    for (key in opt) {
      if (opt.hasOwnProperty(key)) {
        obj[key] = opt[key]
      }
    }

    return obj;
  }
}

window.util = window.util || util;