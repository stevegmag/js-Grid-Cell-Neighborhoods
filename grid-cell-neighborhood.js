/**
 * Count cells within N steps of any positive value in a 2D grid
 */
function countNeighborCells(grid, n) {
  if (!grid || grid.length === 0 || grid[0].length === 0) {
      return { count: 0, cells: new Set() }; 
  }

  const height = grid.length;
  const width = grid[0].length;

  // Use Set to track unique cells within the threshold
  // Format: "row,col"
  const neighborhoodCells = new Set();
  const positiveCells = new Set();

  // Find all positive values first
  for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
          if (grid[row][col] > 0) {
              positiveCells.add(`${row},${col}`);

              // For each positive value, add all cells within N steps to the Set
              for (let r = Math.max(0, row - n); r <= Math.min(height - 1, row + n); r++) {
                  for (let c = Math.max(0, col - n); c <= Math.min(width - 1, col + n); c++) {
                      // Calculate Manhattan distance
                      const distance = Math.abs(row - r) + Math.abs(col - c);
                      if (distance <= n) {
                          neighborhoodCells.add(`${r},${c}`);
                      }
                  }
              }
          }
      }
  }

  return { 
      count: neighborhoodCells.size, 
      cells: neighborhoodCells,
      positiveCells: positiveCells
  };
}

/**
* Create a visual grid representation
*/
function createVisualGrid(grid, n, containerId, countId) {
  const result = countNeighborCells(grid, n);
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  const height = grid.length;
  const width = grid[0].length;

  for (let row = 0; row < height; row++) {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'row';

      for (let col = 0; col < width; col++) {
          const cell = document.createElement('div');
          cell.className = 'cell';

          const key = `${row},${col}`;
          if (result.positiveCells.has(key)) {
              cell.className += ' positive';
          } else if (result.cells.has(key)) {
              cell.className += ' neighborhood';
          } else {
              cell.className += ' empty';
          }

          rowDiv.appendChild(cell);
      }

      container.appendChild(rowDiv);
  }

  // Update count
  document.getElementById(countId).textContent = result.count;

  return result;
}

// Set bounds for grid array; passed to examples in onload function
const displayGridH = 9;
const displayGridW = 9;

// Example 1: One positive cell fully contained; N=3
function example1(daH, daW) {
  const grid = Array(daH).fill().map(() => Array(daW).fill(0)); // create a 9x9 grid array filled with zeros
  grid[4][4] = 1; // Positive value at center for 9x19 (zero-based indexing will display at 5,5)

  const n = 3; // Neighborhood distance
  return createVisualGrid(grid, n, 'grid1', 'count1');
}

// Example 2: One positive cell near an edge; N=3
function example2(daH, daW) {
  const grid = Array(daH).fill().map(() => Array(daW).fill(0));
  grid[4][1] = 1; // Positive value near left edge

  const n = 3;
  return createVisualGrid(grid, n, 'grid2', 'count2');
}

// Example 3: Two positive values with disjoint neighborhoods; N=2
function example3(daH, daW) {
  const grid = Array(daH).fill().map(() => Array(daW).fill(0));
  grid[2][6] = 1; // First positive value
  grid[6][3] = 1; // Second positive value

  const n = 2;
  return createVisualGrid(grid, n, 'grid3', 'count3');
}

// Example 4: Two positive values with overlapping neighborhoods; N=2
function example4(daH, daW) {
  const grid = Array(daH).fill().map(() => Array(daW).fill(0));
  grid[5][3] = 1; // First positive value
  grid[4][5] = 1; // Second positive value

  const n = 2;
  const result = createVisualGrid(grid, n, 'grid4', 'count4');

  // Find overlapping cells
  const grid1 = Array(daH).fill().map(() => Array(daW).fill(0));
  grid1[7][4] = 1;
  const n1 = countNeighborCells(grid1, 2);

  const grid2 = Array(daH).fill().map(() => Array(daW).fill(0));
  grid2[7][6] = 1;
  const n2 = countNeighborCells(grid2, 2);

  // Find overlapping cells
  const cells1 = n1.cells;
  const cells2 = n2.cells;
  const overlapping = [...cells1].filter(key => cells2.has(key));

  // Display overlapping cells
  const overlappingDiv = document.getElementById('overlapping');
  overlappingDiv.innerHTML = `<p>Overlapping cells: ${overlapping.join(', ')} (${overlapping.length} cells total)</p>`;

  return result;
}

// Additional test cases
function additionalTests() {
  // Test case for N = 0
  const gridN0 = Array(5).fill().map(() => Array(5).fill(0));
  gridN0[2][2] = 1; // Single positive value
  createVisualGrid(gridN0, 0, 'gridN0', 'countN0');

  // Test case for positive values in corners
  const gridCorner = Array(5).fill().map(() => Array(5).fill(0));
  gridCorner[0][0] = 1; // Corner positive value
  createVisualGrid(gridCorner, 2, 'gridCorner', 'countCorner');

  // Test case for multiple adjacent positive values
  const gridAdjacent = Array(5).fill().map(() => Array(5).fill(0));
  gridAdjacent[2][2] = 1;
  gridAdjacent[2][3] = 1;
  createVisualGrid(gridAdjacent, 1, 'gridAdjacent', 'countAdjacent');
}

// Run all examples when the page loads
window.onload = function() {
  example1(displayGridH, displayGridW);
  example2(displayGridH, displayGridW);
  example3(displayGridH, displayGridW);
  example4(displayGridH, displayGridW);
  additionalTests(); // hard set to 5x5 internally

  document.getElementById('gridSize').textContent = displayGridH + ' x ' + displayGridW;

  // Add event listener for showing additional tests
  document.getElementById('showAdditional').addEventListener('click', function() {
      const additionalDiv = document.getElementById('additionalTests');
      if (additionalDiv.style.display === 'none') {
          additionalDiv.style.display = 'block';
          this.textContent = 'Hide Additional Test Cases';
      } else {
          additionalDiv.style.display = 'none';
          this.textContent = 'Show Additional Test Cases';
      }
  });
};