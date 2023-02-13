const cl = console.log;

const postForm = document.getElementById("postForm");
const titleControl = document.getElementById("title");
const contentControl = document.getElementById("content");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");

const baseUrl = `http://localhost:3000/posts`;
let postArr = [];

const templating = (arr) => {
    let result = '';
    arr.forEach(post => {
        result += `
                <div class="card mb-4" id="${post.id}">
                    <div class="card-header">
                        ${post.title}
                    </div>
                    <div class="card-body">
                        ${post.body}
                    </div>
                    <div class="card-footer text-right">
                        <button class="btn btn-primary" onclick="onEditHandler(this)">edit</button>
                        <button class="btn btn-danger" onclick="onDeleteHandler(this)">delete</button>
                    </div>
                </div>
        `;
    });
    document.getElementById("postCardContainer").innerHTML = result;
};

const onEditHandler = (ele) => {
   let editId = ele.closest(".card").id;
   sessionStorage.setItem("updateId", editId);
    // cl(postArr);
    // let editObj = postArr.find(obj => obj.id === +editId);// unary plus operator converts string value to number 
    // cl(editObj);
    // titleControl.value = editObj.title;
    // contentControl.value = editObj.body;

    // alternate way for getting data on form controls for edit >> this is wiill not take much iteration to find the obj it directly get data from the database. 
    let editUrl = `${baseUrl}/${editId}`;
    makeApiCall("GET", editUrl,null)
        .then(res => {
            let editObj = JSON.parse(res);
            titleControl.value = editObj.title,
            contentControl.value = editObj.body
        })
        .catch(cl);
    submitBtn.classList.add("d-none");
    updateBtn.classList.remove("d-none");
};

const onUpdateHandler = (eve) => {
    let updateId = sessionStorage.getItem("updateId");
    // cl(updateId);
    let updateUrl = `${baseUrl}/${updateId}`;
    let obj = {
        title : titleControl.value,
        body : contentControl.value
    };
    makeApiCall("PATCH", updateUrl, obj)
        .then(cl)
        .catch(cl);
};

const onDeleteHandler = (ele) => {
    let deleteId = ele.closest(".card").id;
    // cl(deleteId);
    let deleteUrl = `${baseUrl}/${deleteId}`;
    makeApiCall("DELETE", deleteUrl).then(cl).catch(cl);
};

const makeApiCall = (method, apiUrl, body) => {
   return new Promise((resolve,reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(method,apiUrl);
        xhr.setRequestHeader("content-type", "application/json");
        xhr.onload = function(){
            if(this.status === 200 || this.status === 201){
                resolve(this.response)
            }
        };
        xhr.onerror = () => {
            reject("something went wrong");
        }
        xhr.send(JSON.stringify(body));
   });
};

// why we use setRequestHeader >> because while creating api backend developer create some restriction on the api for security purpose so when we login into the site we get some barrer token or jwt value for accessing data from database we require this token as a authentication hence we need to set setRequestHeader.

// call api for get data 
makeApiCall("GET", baseUrl, null)
    .then(res => {
        // cl(res);
        let getArr = JSON.parse(res);
        postArr = getArr;
        templating(getArr);
    })
    .catch(cl);

const onPostFormHandler = (eve) => {
    eve.preventDefault();
    let obj = {
        title : titleControl.value,
        body : contentControl.value,
        userId : Math.ceil(Math.random() * 10),
    }
    eve.target.reset();
    makeApiCall("POST", baseUrl, obj)
        // .then(res => cl(res)) 
        .then(cl) // we can write above line like this also
        .catch(cl);
};    


postForm.addEventListener("submit", onPostFormHandler);
updateBtn.addEventListener("click", onUpdateHandler);