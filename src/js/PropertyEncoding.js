(function() {

  tabris.PropertyEncoding = {

    boolean: function(bool) {
      return !!bool;
    },

    string: function(str) {
      return "" + str;
    },

    natural: function(number) {
      if (typeof number !== "number") {
        throw new Error(typeof number + " is not a number: " + number);
      }
      if (isNaN(number) || number === Infinity || number === -Infinity) {
        throw new Error("Number is not a valid value: " + number);
      }
      if (number < 0) {
        return 0;
      }
      return Math.round(number);
    },

    integer: function(number) {
      if (typeof number !== "number") {
        throw new Error(typeof number + " is not a number: " + number);
      }
      if (isNaN(number) || number === Infinity || number === -Infinity) {
        throw new Error("Number is not a valid value: " + number);
      }
      return Math.round(number);
    },

    choice: function(value, acceptable) {
      if (Array.isArray(acceptable)) {
        if (acceptable.indexOf(value) === -1) {
          throwNotAcceptedError(acceptable, value);
        }
        return value;
      }
      if (!(value in acceptable)) {
        throwNotAcceptedError(Object.keys(acceptable), value);
      }
      return acceptable[value];
    },

    color: function(value) {
      if (value === "initial") {
        return null;
      }
      return util.colorStringToArray(value);
    },

    font: function(value) {
      if (value === "initial") {
        return null;
      }
      return util.fontStringToArray(value);
    },

    image: function(value) {
      if (typeof value === "string") {
        value = {src: value};
      }
      if (!value || typeof value !== "object") {
        throw new Error("Not an image: " + value);
      }
      if (typeof value.src !== "string") {
        throw new Error("image.src is not a string");
      }
      if (value.src === "") {
        throw new Error("image.src is an empty string");
      }
      ["scale", "width", "height"].forEach(function(prop) {
        if (prop in value && !isDimension(value[prop])) {
          throw new Error("image." + prop + " is not a dimension: " + value[prop]);
        }
      });
      if ("scale" in value && ("width" in value || "height" in value)) {
        console.warn("Image scale is ignored if width or height are given");
      }
      return util.imageToArray(value);
    },

    layoutData: function(value) {
      return tabris.Layout.checkLayoutData(value);
    },

    bounds: function(value) {
      return [value.left, value.top, value.width, value.height];
    },

    proxy: function(value) {
      if (value instanceof tabris.Proxy) {
        return value.cid;
      }
      if (value instanceof tabris.ProxyCollection) {
        return value[0] ? value[0].cid : null;
      }
      return value;
    },

    nullable: function(value, altCheck) {
      if (value === null) {
        return value;
      }
      return tabris.PropertyEncoding[altCheck](value);
    }

  };

  function isDimension(value) {
    return typeof value === "number" && !isNaN(value) && value >= 0 && value !== Infinity;
  }

  function throwNotAcceptedError(acceptable, given) {
    var message = ["Accepting \""];
    message.push(acceptable.join("\", \""));
    message.push("\", given was: \"", given + "\"");
    throw new Error(message.join(""));
  }

}());
