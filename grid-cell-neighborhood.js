/**
 * Count cells within N steps of any positive value in a 2D grid
 */

// update function to accept main(5, 5, 2, [[2,2]])  -- main(xCount, yCount, n, positiveCells) 
function countNeighborCells(gridW, gridH, n, possCell) {
  // if (!grid || grid.length === 0 || grid[0].length === 0) {
  //     return { count: 0, cells: new Set() }; 
  // }

//   const height = gridH;
//   const width = gridW;
//   const possCell = possCell;
//   const n = n;

  // Use Set to track unique cells within the threshold
  // Format: "row,col"
  const neighborhoodCells = new Set();
  const positiveCells = new Set();
  
  for (const [row, col] of possCell) {
    if (row >= 0 && row < gridH && col >= 0 && col < gridW) {
      const key =  `${row},${col}`;
      positiveCells.add(key);
    }
    
    for (let r = Math.max(0, row - n); r <= Math.min(gridH - 1, row + n); r++) {
      for (let c = Math.max(0, col - n); c <= Math.min(gridW - 1, col + n); c++) {
        // Calculate Manhattan distance
        const distance = Math.abs(row - r) + Math.abs(col - c);
        if (distance <= n) {
            neighborhoodCells.add(`${r},${c}`);
        }
      }
    }    
  }
  

// Find all positive values first
// for (let row = 0; row < height; row++) {
//     for (let col = 0; col < width; col++) {
//           if (possCell[row][col] > 0) {
//               positiveCells.add(`${row},${col}`);

//               // For each positive value, add all cells within N steps to the Set
//               for (let r = Math.max(0, row - n); r <= Math.min(height - 1, row + n); r++) {
//                   for (let c = Math.max(0, col - n); c <= Math.min(width - 1, col + n); c++) {
//                       // Calculate Manhattan distance
//                       const distance = Math.abs(row - r) + Math.abs(col - c);
//                       if (distance <= n) {
//                           neighborhoodCells.add(`${r},${c}`);
//                       }
//                   }
//               }
//           }
//       }
//   }

  return { 
      count: neighborhoodCells.size, 
      cells: neighborhoodCells,
      positiveCells: positiveCells
  };
}

/**
* Create a visual grid representation
main(xCount, yCount, n, positiveCells)
*/
function createVisualGrid(gridH, gridW, n, possCell, containerId, countId) {
  const result = countNeighborCells(gridH, gridW, n, possCell);
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  for (let row = 0; row < gridH; row++) {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'row';

      for (let col = 0; col < gridW; col++) {
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
  // const grid = Array(daH).fill().map(() => Array(daW).fill(0)); // create a 9x9 grid arrayfilled with zeros
  const possCel = [[4,4]]; // Positive value at center for 9x19 (zero-based indexing will display at 5,5)

  const n = 3; // Neighborhood distance
  return createVisualGrid(daH, daW, n, possCel, 'grid1', 'count1');
}

// Example 2: One positive cell near an edge; N=3
function example2(daH, daW) {
  // const grid = Array(daH).fill().map(() => Array(daW).fill(0));
  const possCel = [[4,1]]; // Positive value near left edge

  const n = 3;
  return createVisualGrid(daH, daW, n, possCel, 'grid2', 'count2');
}

// Example 3: Two positive values with disjoint neighborhoods; N=2
function example3(daH, daW) {
  // const grid = Array(daH).fill().map(() => Array(daW).fill(0));
  const possCel = [[2,6], [6,3]]; // Fisrt and Second positive value

  const n = 2;
  return createVisualGrid(daH, daW, n, possCel, 'grid3', 'count3');
}

// Example 4: Two positive values with overlapping neighborhoods; N=2
function example4(daH, daW) {
    const possCel = [[5,3], [4,5]]; // Two positive values with overlapping neighborhoods
    const n = 2;
    const result = createVisualGrid(daH, daW, n, possCel, 'grid4', 'count4');

    // Calculate neighborhoods for both positions
    const n1 = countNeighborCells(daH, daW, n, [[5,3]]);
    const n2 = countNeighborCells(daH, daW, n, [[4,5]]);

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
    const possCelN0 = [[2,2]]; // Single positive value
    createVisualGrid(5, 5, 0, possCelN0, 'gridN0', 'countN0');

    // Test case for positive values in corners
    const possCelCorner = [[0,0]]; // Corner positive value
    createVisualGrid(5, 5, 2, possCelCorner, 'gridCorner', 'countCorner');

    // Test case for multiple adjacent positive values
    const possCelAdjacent = [[2,2], [2,3]]; // Adjacent positive values
    createVisualGrid(5, 5, 1, possCelAdjacent, 'gridAdjacent', 'countAdjacent');
}

// Run all examples when the page loads
window.onload = function() {
    example1(displayGridH, displayGridW);
    example2(displayGridH, displayGridW);
    example3(displayGridH, displayGridW);
    example4(displayGridH, displayGridW);
    // additionalTests(); // Uncomment to show additional tests

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

// Example: Test countNeighborCells without display logic
function testNeighborhood() {
    // Parameters:
    // gridWidth: 5
    // gridHeight: 5
    // n (distance): 2
    // positive cells: [[2,2]] (center position)
    const result = countNeighborCells(5, 5, 2, [[2,2]]);
    
    // Create visual representation of the grid for console
    const grid = Array(5).fill().map(() => Array(5).fill('.'));
    
    // Mark neighborhood cells with 'N'
    result.cells.forEach(cell => {
        const [row, col] = cell.split(',').map(Number);
        grid[row][col] = 'N';
    });
    
    // Mark positive cells with 'P'
    result.positiveCells.forEach(cell => {
        const [row, col] = cell.split(',').map(Number);
        grid[row][col] = 'P';
    });
    
    // Output results
    console.log('Grid representation:');
    console.log('P: Positive cell');
    console.log('N: Neighborhood cell');
    console.log('.: Empty cell\n');
    
    // Print grid
    grid.forEach(row => console.log(row.join(' ')));
    
    console.log('\nResults:');
    console.log(`Total cells in neighborhood: ${result.count}`);
    console.log(`Positive cell: 2,2`);
    console.log(`Neighborhood cells: ${[...result.cells].join(' ')}`);
}

// Run the test
testNeighborhood();
