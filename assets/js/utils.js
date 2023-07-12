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
  addClasses(el,...classes) {
    if (classes.length === 1) {
      classes = classes[0].replaceAll(/\s+/ig," ").trim().split(" ");
    }
    classes.forEach(className => {
        el.classList.add(className);
    });
  },

  toggleClasses(el,...classes) {
    classes.forEach(className => {
      el.classList.toggle(className);
  });
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