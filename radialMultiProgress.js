(function($) {
    $.widget("ui.radialMultiProgress", {
        options: {
            thickness: 10,
            'font-size': 12,
            space: 1,
            antiAlias: false,
            scaleLabel: false,
            data: []
        },

        _create: function() {
            this._render();
        },

        _render: function() {
            const svgNS = "http://www.w3.org/2000/svg";
            let currentRadius = 50 - this.options.thickness;
            const labels = [];

            this.element.css({
                'position': 'relative'
            });

            const svg = document.createElementNS(svgNS, 'svg');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            svg.setAttribute('viewBox', '0 0 100 100');
          
            if (this.options.antiAlias) {
                svg.setAttribute('shape-rendering', 'geometricPrecision');
            }

            // Calculate the smallestCircleDiameter before the loop:
            const totalThicknessOfAllCircles = this.options.data.length * this.options.thickness;
            const totalSpaceBetweenCircles = (this.options.data.length - 1) * this.options.space;
            const smallestCircleDiameter = 100 - (totalThicknessOfAllCircles + totalSpaceBetweenCircles);

            for (let i = 0; i < this.options.data.length; i++) {
                const data = this.options.data[i];

                const rangeSpan = data.range[1] - data.range[0];
                const completionPercentage = (data.value - data.range[0]) / rangeSpan;
                const strokeDasharray = 2 * Math.PI * currentRadius;
                const strokeDashoffset = strokeDasharray - (strokeDasharray * completionPercentage);

                const circle = document.createElementNS(svgNS, 'circle');
                circle.setAttribute('cx', '50');
                circle.setAttribute('cy', '50');
                circle.setAttribute('r', currentRadius);
                circle.setAttribute('fill', 'none');
                circle.setAttribute('stroke', data.color);
                circle.setAttribute('stroke-width', this.options.thickness.toString());
                circle.setAttribute('transform', 'rotate(-90 50 50)');
                circle.setAttribute('stroke-dasharray', strokeDasharray);
                circle.setAttribute('stroke-dashoffset', strokeDashoffset);

                svg.appendChild(circle);

                let fontSize = this.options['font-size'];

    if (this.options.scaleLabel) {
        const tempLabel = $("<span>")
            .css({ visibility: "hidden", fontSize: fontSize + "px" })
            .text(data.value)
            .appendTo(document.body);

        const actualLabelWidth = tempLabel.width();

        tempLabel.remove();

        if (actualLabelWidth > smallestCircleDiameter) {
            const scaleRatio = smallestCircleDiameter / actualLabelWidth;
            fontSize *= scaleRatio;
        }
    }

                labels.push(`<div style="color: ${data.color}; font-size: ${fontSize}px">${data.value}</div>`);

                currentRadius -= this.options.thickness + this.options.space;
            }

            const $label = $('<div></div>')
                .css({
                    'position': 'absolute',
                    'top': '50%',
                    'left': '50%',
                    'transform': 'translate(-50%, -50%)',
                    'text-align': 'center',
                    'width': '100%',
                    'pointer-events': 'none'
                })
                .html(labels.join(''));

            this.element.append(svg);
            this.element.append($label);
        },

        updateValue: function(identifier, newValue) {
            let dataEntry = null;

            if (typeof identifier === "number") {
                dataEntry = this.options.data[identifier];
            } else {
                dataEntry = this.options.data.find(item => item.id === identifier);
            }

            if (dataEntry) {
                dataEntry.value = newValue;
                this.element.empty();
                this._render();
            }
        }
    });
}(jQuery));
