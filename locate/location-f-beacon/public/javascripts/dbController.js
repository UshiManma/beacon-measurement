
function updateData(){
    var target_id = document.getElementById('beacon-id').value;
    var target_x = document.getElementById('x-position').value;
    var target_y = document.getElementById('y-position').value;
    let data = {
        key: target_id,
        x: target_x,
        y: target_y
    };
    fetch('/upload').then(
        res => {res.json}).then(
        r => {
        }
    ).catch(err => console.log(`${err}`));
}