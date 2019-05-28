$(document).ready(function() {

    var students = [];
    var searchByName = '';
    var searchByTag = '';

    $.ajax({
        url: "https://api.myjson.com/bins/ojuob",
        type: "GET",
        dataType: "json"
    }).done(function(data) {
        students = data.students;
        students.forEach(student => {
            student.tags = [];
        })
        refreshView(students);
        toggleButton();
        tagInput();
    })

    function refreshView(students) {
        students.forEach(student => {
            $(".list").append(listItem(student));
        });
    }

    function listItem(student) {
        var average = calculateAverage(student.grades);
        var html =
            `
            <div class='col-md-10 col-md-offset-1'style='padding: 5px; overflow: auto;'>
                <p>
                    <img src="${student.pic}">
                    ${student.firstName} ${student.lastName}                        
                </p>
                <p>Email: ${student.email}</p>
                <p>Company: ${student.company}</p>
                <p>Skills: ${student.skill}</p> 
                <p>Average:${average}%</p>                
                <button class='toggleBtn btn btn-primary'><i class="fas fa-plus"></i></button>  
                <div class='additionalInfo'>
                    <div class='grades'>${gradesHtml(student.grades)}</div>
                    <div class='tags'>${tagsHtml(student.tags)}</div>
                    <input type='text' placeholder='Add new tag' id='addTagInput-${student.id}' class='addTagInput' />
                </div>              
            </div> 
        `;
        return html;
    }

    $("#search_by_name").keyup(function() {
        searchByName = $(this).val();
        searchUsers();
    });

    $("#search_by_tag").keyup(function() {
        searchByTag = $(this).val();
        searchUsers();
    });

    function calculateAverage(grades) {
        var sum = 0;
        grades.forEach(grade => {
            sum += parseInt(grade);
        });
        return sum / grades.length;
    }

    function gradesHtml(grades) {
        var html = '';
        if (grades.length > 0) {
            grades.forEach((grade, index) => {
                html +=
                    `
                    <div>
                        <span>Test ${index + 1}:</span>
                        <span>${grade}%</span>
                    </div>
                `
            });
        }
        return html;
    }

    function tagsHtml(tags) {
        var html = '';
        tags.forEach((tag) => {
            html +=
                `
                    <span class='tag'>${tag}</span>
                `
        });
        return html;
    }

    function searchUsers() {
        var html_data = "";
        students.forEach(function(student) {
            if (
                (student.firstName.substring(0, searchByName.length).toLowerCase() ==
                    searchByName.toLowerCase() ||
                    student.lastName.substring(0, searchByName.length).toLowerCase() ==
                    searchByName.toLowerCase()) &&
                (searchByTag === '' || tagsMatchingSearch(student.tags))
            ) {
                html_data += listItem(student);
            }
        });
        $(".list").html(html_data);
        toggleButton();
        tagInput();
    }

    function tagsMatchingSearch(tags) {
        for (index in tags) {
            if (tags[index].substring(0, searchByTag.length).toLowerCase() ==
                searchByTag.toLowerCase()) {
                return true;
            }
        }
        return false;
    }

    function toggleButton() {
        var toggleBtnCollection = document.getElementsByClassName("toggleBtn");
        Array.from(toggleBtnCollection).forEach(toggleBtn => {
            toggleBtn.addEventListener("click", function() {

                var infoPanel = this.parentElement.lastElementChild;
                if (infoPanel.classList.contains("show")) {
                    infoPanel.classList.remove("show");
                } else {
                    infoPanel.classList.add("show");
                }
            });
        });
    }

    function tagInput() {
        var tagInputCollection = document.getElementsByClassName("addTagInput");
        Array.from(tagInputCollection).forEach(tagInput => {
            tagInput.addEventListener("keydown", function(e) {
                if (e.keyCode === 13) {
                    var studentId = this.id.split('addTagInput-')[1];
                    students.forEach(student => {
                        if (student.id === studentId) {
                            student.tags.push(tagInput.value);
                        }
                    });
                    var divTags = this.parentElement.getElementsByClassName("tags")[0];
                    var tagSpan = document.createElement('span');
                    tagSpan.classList.add("tag");
                    tagSpan.innerHTML = tagInput.value;
                    divTags.append(tagSpan);
                    tagInput.value = '';
                }
            });
        });
    }
})