var plainTextToMultilineText;
plainTextToMultilineText = function() {
  function plainTextToMultilineText(input, charsPerLine, cutLongWord) {
    this.input = (input && typeof(input) === "string" && input.trim().length > 0) ? input : "";
    this.charsPerLine = (charsPerLine && parseInt(charsPerLine) >= 16) ? parseInt(charsPerLine) : 16;
    this.cutLongWord = (cutLongWord === false) ? false : true;
  }
  plainTextToMultilineText.prototype.init = function() {
    var output = this.splitToWords(this.input);
    output = this.removeWhitespace(output);
    output = this.joinWords({glued:[], last:"", words:output});
    while (typeof(output) !== "string") {
      output = this.joinWords(output);
    }
    return String(output);
  };
  plainTextToMultilineText.prototype.splitToWords = function(str) {
    var words;
    words = [];
    if (str && typeof(str) === "string") {
      words = str.split(" ");
    }
    return words;
  };
  plainTextToMultilineText.prototype.removeWhitespace = function(strArray) {
    var i, word, words;
    words = [];
    if (strArray && strArray.length > 0) {
      for (i = 0;i < strArray.length;i++) {
        word = "";
        word = function(w) {
          if (w && typeof(w) === "string") {
            return String(w.replace(/\s+/g, ""));
          } else {
            return "";
          }
        }(strArray[i]);
        if (word.trim().length > 0) {
          words.push(word);
        }
      }
    }
    return words;
  };
  plainTextToMultilineText.prototype.joinWords = function(obj) {
    var i, j, part, parts, testGlue;
    var output = "";
    var glued = (typeof(obj) === "object" && obj.hasOwnProperty("glued") && Object.prototype.toString.call(obj.glued) === "[object Array]" && obj.glued.length > 0) ? obj.glued : [];
    var words = (typeof(obj) === "object" && obj.hasOwnProperty("words") && Object.prototype.toString.call(obj.words) === "[object Array]" && obj.words.length > 0) ? obj.words : [];
    var last = (typeof(obj) === "object" && obj.hasOwnProperty("last") && typeof(obj.last) === "string" && obj.last.length > 0) ? obj.last : "";
    for (i = 0;i < words.length;i++) {
      part = words[i];
      parts = [];
      if (part.length > this.charsPerLine && this.cutLongWord === true) {
        for (j = 0;j < Math.ceil(part.length / this.charsPerLine);j++) {
          parts[j] = part.substr(j * this.charsPerLine, this.charsPerLine);
        }
        if(last.length > 0) {
          glued.push(last);
        }
        glued.push(parts[0]);
        return {glued:glued, last:"", words:parts.slice(1).concat(words.slice(i + 1))};
      } else if (part.length > this.charsPerLine && this.cutLongWord === false) {
        if(last.length > 0) {
          glued.push(last);
        }
        glued.push(part);
        return {glued:glued, last:"", words:words.slice(i + 1)};
      }
      testGlue = (last.length > 0) ? last + " " + part : part;
      if (testGlue.length <= this.charsPerLine) {
        last = testGlue;
      } else {
        glued.push(last);
        return {glued:glued, last:part, words:words.slice(i + 1)};
      }
    }
    output = glued.join("\n") + "\n" + last;
    return String(output);
  };
  return plainTextToMultilineText;
}();
