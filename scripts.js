


// Simulated data to display on the dashboard
const data = {
    products: 25,
    invoices: 15,
    users: 10,
    stocks: 5
};

// Function to update the dashboard with the data
function updateDashboard() {
    document.getElementById('total-products').textContent = data.products;
    document.getElementById('total-invoices').textContent = data.invoices;
    document.getElementById('total-users').textContent = data.users;
    document.getElementById('total-stocks').textContent = data.stocks;
}

// Update stats when the page loads
window.onload = updateDashboard;

// Click event to increment values for interaction
document.querySelectorAll('.cursor-pointer').forEach(card => {
    card.addEventListener('click', () => {
        const id = card.id.split('-')[0];  // Extracts 'products', 'orders', etc.
        data[id]++;
        updateDashboard();
    });
});

// Redirect to the product management page when the "Products" card is clicked
document.getElementById('products-card').addEventListener('click', function() {
   window.location.href = 'products.html'; // Redirect to product management page
});


/*document.getElementById('products-card').addEventListener('click', function(event) {
    event.stopPropagation(); // Prevents incrementing

    alert("Redirecting to Products Page!"); // Debugging step

    window.location.href = 'products.html';
});
*/
