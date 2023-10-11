# jqueryui-progress-rings
A jQueryUI widget to make radial progress rings

# Examples
Two rings.
```js
$("#multi").radialMultiProgress({
    thickness: 10,
    space: 0,
    antiAlias: true,
    scaleLabel: true,
    data: [
        { id: 'yellowBar', color: "yellow", range: [0, 11111159], value: 12 },
        { id: 'redBar', color: "red", range: [0, 59], value: 23 }
    ]
});
```

A Clock!
```js
    $("#clock").radialMultiProgress({
        thickness: 8,
        space: 1,
        "font-size": 24,
        antiAlias: true,
        scaleLabel: true,
        data: [
            { id: 'hours', color: "blue", range: [0, 23], value: 0 },
            { id: 'minutes', color: "yellow", range: [0, 59], value: 0 },
            { id: 'seconds', color: "red", range: [0, 59], value: 0 }
        ]
    });

    function getCurrentTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        return { hours, minutes, seconds };
    }

    function updateClock() {
        const { hours, minutes, seconds } = getCurrentTime();
        $("#clock").radialMultiProgress('updateValue', 'hours', hours);
        $("#clock").radialMultiProgress('updateValue', 'minutes', minutes);
        $("#clock").radialMultiProgress('updateValue', 'seconds', seconds);
    }

    setInterval(updateClock, 1000);
    updateClock();  // initial update
```

Update value examples
```js
$("#multi").radialMultiProgress('updateValue', 0, 11196130);      // By index
$("#multi").radialMultiProgress('updateValue', 'redBar', 50); // By ID
```
