function handleClick() {
    fetch('/create-schedule', {method: 'POST'})
        .then(response => {
            if (response.ok) {
                return response.text();
            } else{
                throw new Error('failed to run python script');
            }
        })
        .then(result => {
            if (result === 0){
                console.log("Success!")
            } else{
                console.log("Python Script Failed");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('button1');
    button.addEventListener('click', handleClick);
})