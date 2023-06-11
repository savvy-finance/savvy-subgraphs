
async function main() {
    await fetch('https://api.studio.thegraph.com/query/42355/savvy-lge/version/latest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        query: `
            {
                userPositions(first: 5) {
                id
                totalDeposited
                totalAllotments
            }
        }`
    }),
    })
    .then(response => response.json())
    .then(data => console.log('data returned:', data));
}

main();