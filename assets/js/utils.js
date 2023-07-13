const utils = {
  /**
   * executes a method on each element
   * @param {NodeListOf<Element> | HTMLElement[]} nodeList - result of a "querySelectorAll"
   * @param {String | Function} callback - a string with the name of the element method, or a function where an HTMLElement is the first parameter
   * @param {any} args - any arguments to pass to the method
   */
  each(nodeList,callback,...args ) {
    
    nodeList.forEach(el => {
      try {
        return callback(el, ...args);
      } catch  {
        if (callback.includes(".")) {
          let accumulator;
          const method = callback.split(".").reduce((obj, key) => {accumulator = obj; return obj[key]}, el);
          return method.call(accumulator,...args);
        }
        return el[callback](...args);
      } 
    })
  },

  /**
   * Add many classes to an element
   * @param {HTMLElement} el 
   * @param {String} classes - classes separated by spaces, just like in the html
   */
  addClass(el,...classes) {
    if (classes.length === 1) {
      classes = classes[0].replaceAll(/\s+/ig," ").trim().split(" ");
    }
    classes.forEach(className => {
        el.classList.add(className);
    });
  },

  toggleClass(el,...classes) {
    classes.forEach(className => {
      el.classList.toggle(className);
  });
  },

  addRemoveClass(el,class1,class2) {
    el.classList.add(class1);
    el.classList.remove(class2);
  },

  /**
   * Set many attributes at once
   * @param {HTMLElement} el - element to set attributes on
   * @param {Array} attrValPairs - Attribute-Value pairs
   * - {String} `attrValPairs[0]` - name of the attribute
   * - {String} `attrValPairs[1]` - the value to set the attribute to
   */
  setAttributes(el,...attrValPairs) {
    attrValPairs.forEach(pair => {
      const [attr,val] = pair;
      el.setAttribute(attr,val);
    })
  },

    /**
   * Set many data attributes at once.  el.setAttribute("data-"+attr,val);
   * @param {HTMLElement} el - element to set attributes on
   * @param {Array} attrValPairs - Attribute-Value pairs, an array of two-item arrays of the structure [attribute, value];
   */
  setDataAttributes(el,...attrValPairs) {
    attrValPairs.forEach(pair => {
      const [attr,val] = pair;
      el.setAttribute("data-"+attr,val);
    })
  }
}

const display = { 
  show(el) {
    el.classList.add("show");
    el.classList.remove("hide");
  },
  hide(el) {
    el.classList.add("hide");
    el.classList.remove("show");
  }
}