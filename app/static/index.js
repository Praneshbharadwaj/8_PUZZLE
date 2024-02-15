window.onload = () => {

    // Destination position array
    const destinationPosition = [1, 2, 3, 4, 5, 6, 7, 8, 0];

    $.get("/shuffle", (data) => {
        tiles = data.flat();
        steps = 0;
        renderTiles($('.eight-puzzle'));
    });

    var steps = 0; // Counter variable for steps taken

    $('#shuffleButton').click(() => {
        // Hide the texts "Steps to solve: xx" and "Next step: xx"
        $('#stepsTaken, #nextStep').hide();

        $.get("/shuffle", (data) => {
            tiles = data.flat();
            steps = 0;
            renderTiles($('.eight-puzzle'));
        });
    });

    $('#solveButton').click(() => {
        // Convert tiles to a 2D array
        var tiles_2d = [];
        for (var i = 0; i < tiles.length; i += 3) {
            tiles_2d.push(tiles.slice(i, i + 3));
        }

        $.ajax({
            url: '/solve',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ puzzle: tiles_2d }), // Send the 2D array
            success: function (response) {
                // Handle successful response from the server
                console.log('Steps to solve:', response.steps);
                console.log('Next step:', response.next_step);

                // Display steps taken
                $('#stepsTaken').text('Steps to solve: ' + response.steps).show();

                if (response.steps > 0) {
                    // Display next step only if steps are greater than 0
                    $('#nextStep').text('Next step: ' + response.next_step).show();
                } else {
                    // Hide next step if steps become 0
                    $('#nextStep').hide();

                    // Check if all pieces are in the solved position
                    var flattenedTiles = tiles.flat();
                    if (flattenedTiles.every((val, index) => val === destinationPosition[index])) {
                        // Add party poppers and "Congratulations" text to the website
                        $('body').append('<div id="overlay"><div id="congratulations"><h1>Congratulations!</h1></div></div>');
                    }
                }
            },
            error: function (xhr, status, error) {
                // Handle error response from the server
                console.error('Error:', error);
            }
        });
    });

    var $target = undefined;

    // Function to update the 2D array representation of the grid
    var updateGrid = function () {
        var grid = [];
        for (var i = 0; i < tiles.length; i += 3) {
            grid.push(tiles.slice(i, i + 3));
        }
        console.log(grid); // Log the updated grid
    };

    var renderTiles = function ($newTarget) {
        $target = $newTarget || $target;

        var $ul = $("<ul>").addClass("n-puzzle");

        $(tiles).each(function (index) {
            var correct = index + 1 == this;
            var cssClass = this == 0 ? "empty" : (correct ? "correct" : "incorrect");

            var $li = $("<li>").addClass(cssClass).attr("data-tile", this).text(this);
            $li.click({ index: index }, shiftTile);
            $ul.append($li);
        });

        var solvable = checkSolvable();

        // Update the HTML to display the counter value
        $target.html($ul).append("<p class='counter'>Steps taken: " + steps + "</p>");

        updateGrid(); // Call the function to update the 2D array representation of the grid
    };

    var checkSolvable = function () {
        var sum = 0;
        for (var i = 0; i < tiles.length; i++) {
            // Your solvability checking logic here
        }
    };

    var shiftTile = function (event) {
        var index = event.data.index;

        var targetIndex = -1;
        if (index - 1 >= 0 && tiles[index - 1] == 0) { // check left
            targetIndex = index - 1;
        } else if (index + 1 < tiles.length && tiles[index + 1] == 0) { // check right
            targetIndex = index + 1;
        } else if (index - 3 >= 0 && tiles[index - 3] == 0) { //check up
            targetIndex = index - 3;
        } else if (index + 3 < tiles.length && tiles[index + 3] == 0) { // check down
            targetIndex = index + 3;
        }

        if (targetIndex != -1) {
            var temp = tiles[targetIndex];
            tiles[targetIndex] = tiles[index];
            tiles[index] = temp;
            steps++; // Increment the counter
            renderTiles();
            updateGrid(); // Log the updated grid

            // Check if all pieces are in the correct order
            var flattenedTiles = tiles.flat();
            if (flattenedTiles.every((val, index) => val === destinationPosition[index])) {
                // Add party poppers and "Congratulations" text to the website
                $('body').append('<div id="overlay"><div id="congratulations"><h1>Congratulations!</h1><img src="https://media4.giphy.com/media/nagxKKFv9vVCj2mB4J/200w.gif?cid=6c09b952pslsc8hg9m0mxi8t0ocpd09k9dqiewu4i2m2zbm0&ep=v1_gifs_search&rid=200w.gif&ct=g" class="img" alt="Full Screen Image"></div></div>');

            }
        }

        event.preventDefault();
    };

    renderTiles($('.eight-puzzle'));
};
