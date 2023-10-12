(function ($) {
  $.widget("ui.radialMultiProgress", {
    options: {
      thickness: 10,
      "font-size": 12,
      "base-color": "#333",
      space: 1,
      antiAlias: false,
      scaleLabel: false,
      centerContent: "",
      responsive: false,
      data: []
    },

    _create: function () {
      this._render();
    },

    _createCircle: function (
      svgNS,
      cx,
      cy,
      r,
      fill,
      stroke,
      strokeWidth,
      transform,
      dashArray,
      dashOffset,
      animation
    ) {
      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttribute("cx", cx);
      circle.setAttribute("cy", cy);
      circle.setAttribute("r", r);
      circle.setAttribute("fill", fill);
      circle.setAttribute("stroke", stroke);
      circle.setAttribute("stroke-width", strokeWidth);
      circle.setAttribute("transform", transform);
      if (dashArray) {
        circle.setAttribute("stroke-dasharray", dashArray);
        circle.setAttribute("stroke-dashoffset", dashOffset);
        if (animation) {
          circle.style.transition = `stroke-dashoffset ${animation.duration} ${animation.style}`;
        }
      }
      return circle;
    },

_render: function () {
    const svgNS = "http://www.w3.org/2000/svg";
    let currentRadius = 50 - this.options.thickness;
    this.element.css("position", "relative");
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", "0 0 100 100");

    if (this.options.antiAlias) {
        svg.setAttribute("shape-rendering", "geometricPrecision");
    }

    if (this.options.responsive) {
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    }

    const labels = [];
    
    this.options.data.forEach((data) => {
        const rangeSpan = data.range[1] - data.range[0];
        const completionPercentage = (data.value - data.range[0]) / rangeSpan;
        const strokeDasharray = 2 * Math.PI * currentRadius;

        const rotationVal = (data.startAngle || 0) - 90;
        const strokeDashoffset = strokeDasharray * completionPercentage;

        svg.appendChild(
            this._createCircle(
                svgNS,
                "50",
                "50",
                currentRadius.toString(),
                "none",
                this.options["base-color"],
                this.options.thickness.toString(),
                `rotate(${rotationVal} 50 50)`
            )
        );
        svg.appendChild(
            this._createCircle(
                svgNS,
                "50",
                "50",
                currentRadius.toString(),
                "none",
                data.color,
                this.options.thickness.toString(),
                `rotate(${rotationVal} 50 50)`,
                strokeDasharray,
                strokeDashoffset,
                data.animation
            )
        );

        let fontSize = this.options["font-size"];
        if (this.options.scaleLabel) {
            fontSize = this._getScaledFontSize(data.value, fontSize);
        }
        if (!data.hideLabel) {
            labels.push(
                `<div style="color: ${data.color}; font-size: ${fontSize}px">${data.value}</div>`
            );
        }

        currentRadius -= this.options.thickness + this.options.space;
    });

    this.element.append(
        svg,
        $("<div></div>")
            .css({
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                "text-align": "center",
                width: "100%",
                "pointer-events": "none"
            })
            .html(this.options.centerContent + labels.join(""))
    );
},


    _getScaledFontSize: function (value, initialFontSize) {
      const tempLabel = $("<span>")
        .css({ visibility: "hidden", fontSize: initialFontSize + "px" })
        .text(value)
        .appendTo(document.body);

      const actualLabelWidth = tempLabel.width();
      tempLabel.remove();

      const totalThicknessOfAllCircles =
        this.options.data.length * this.options.thickness;
      const totalSpaceBetweenCircles =
        (this.options.data.length - 1) * this.options.space;
      const smallestCircleDiameter =
        100 - (totalThicknessOfAllCircles + totalSpaceBetweenCircles);
      return actualLabelWidth > smallestCircleDiameter 
        ? initialFontSize * (smallestCircleDiameter / actualLabelWidth) 
        : initialFontSize;
    },

    updateValue: function (identifier, newValue) {
      const index = typeof identifier === "number" 
        ? identifier 
        : this.options.data.findIndex((item) => item.id === identifier);

      if (index !== -1) {
        const data = this.options.data[index];
        data.value = newValue;

        const rangeSpan = data.range[1] - data.range[0];
        const completionPercentage = (data.value - data.range[0]) / rangeSpan;
        const currentRadius = 50 - this.options.thickness * (index + 1) - this.options.space * index;
        const strokeDasharray = 2 * Math.PI * currentRadius;
        const newStrokeDashoffset = strokeDasharray * (1 - completionPercentage);

        const circleElements = this.element.find("svg > circle");
        if (circleElements.length > index * 2 + 1) {
          const circle = circleElements[index * 2 + 1];
          circle.setAttribute("stroke-dashoffset", newStrokeDashoffset);

          if (data.animation) {
            circle.style.transition = `stroke-dashoffset ${data.animation.duration} ${data.animation.style}`;
          }
        }

        const labelElements = this.element.find("div > div");
        if (labelElements.length > index) {
          const label = labelElements[index];
          const labelText = data.hideLabel ? "" : newValue;
          $(label).text(labelText);
        }
      }
    },

    setAnimation: function (identifier, animationAttributes) {
      const index = typeof identifier === "number" 
        ? identifier 
        : this.options.data.findIndex((item) => item.id === identifier);

      if (index !== -1) {
        const data = this.options.data[index];
        data.animation = animationAttributes;

        const circleElements = this.element.find("svg > circle");
        if (circleElements.length > index * 2 + 1) {
          const circle = circleElements[index * 2 + 1];
          if (data.animation) {
            circle.style.transition = `stroke-dashoffset ${data.animation.duration} ${data.animation.style}`;
          }
        }
      }
    },

    _destroy: function() {
      this.element.empty();
    },

    getValue: function (identifier) {
      const index = typeof identifier === "number" 
        ? identifier 
        : this.options.data.findIndex((item) => item.id === identifier);

      if (index !== -1) {
        return this.options.data[index].value;
      }
      return null;
    },

    getOption: function (optionKey) {
      return this.options[optionKey];
    },

    setOption: function (optionKey, value) {
      this.options[optionKey] = value;
      this._render();
    }
  });
})(jQuery);
