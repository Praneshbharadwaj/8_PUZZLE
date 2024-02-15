window.onload = () => {

    var tiles = [2, 3, 1, 4, 5, 6, 7, 8, 0];
    var steps = 0; // Counter variable for steps taken

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
        }

        event.preventDefault();
    };

    renderTiles($('.eight-puzzle'));
};