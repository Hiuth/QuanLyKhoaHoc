async function findInstructorById(id) {
    const apiUrl = `http://localhost:8099/instructor/finInstructorById/${id}`;
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error('Lỗi khi gọi API');
        }
        const data = await response.json();
        return data.Name;
    } catch (error) {
        console.error('Lỗi:', error);
        return 'N/A'; // Trả về giá trị mặc định nếu có lỗi
    }
}

async function findAllInstructor(name) {
    const apiUrl = `http://localhost:8099/instructor/allInstructor`;
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error('Lỗi khi gọi API');
        }

        const data = await response.json();
        const element = name;
        const selectElement = document.getElementById(element);
        selectElement.innerHTML = ''; // Xóa các tùy chọn cũ

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Chọn người hướng dẫn';
        selectElement.appendChild(defaultOption);

        data.forEach(instructor => {
            const option = document.createElement('option');
            option.value = instructor.InstructorID; // hoặc khóa chính phù hợp
            option.textContent = instructor.Name; // hoặc tên trường dữ liệu phù hợp
            selectElement.appendChild(option);
        });

    } catch (error) {
        console.error('Lỗi:', error);
    }
}


async function fetchAllCourse() {
    const apiUrl = 'http://localhost:8099/course/allCourses';
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error('Lỗi khi gọi API');
        }
        const data = await response.json();
        const courseList = document.querySelector('.course-table tbody');
        courseList.innerHTML = ''; // Xóa nội dung cũ

        for (const course of data) {
            const instructorName = await findInstructorById(course.InstructorID);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td id="courseName">${course.CourseName}</td>
                <td id="courseDescription">${course.Description}</td>
                <td id="courseStartDate">${course.StartDate}</td>
                <td id="courseEndDate">${course.EndDate}</td>
                <td id="courseTuition">${course.Tuition}</td>
                <td id="courseStatus">${course.Status}</td>
                <td id="courseInstructorName">${instructorName}</td>
                <td>
                    <input type="hidden" name="courseId" id="courseId" value="${course.CourseID}">
                    <div class="action-buttons">
                        <button class="btn-icon btn-edit" onclick="showModalCourse('editCourseModal',event)">✎</button>
                        <button class="btn-icon btn-delete" onclick="deleteCourse(event)">×</button>
                    </div>
                </td>
            `;
            courseList.appendChild(row); // Thêm row vào tbody
        }
    } catch (error) {
        console.error('Lỗi:', error);
    }
}


function showModalCourse(modalId,event) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "block";
    }

    // Tìm nút được nhấn và hàng <tr> chứa nút đó
    const button = event.target; // Lấy phần tử nút đã được nhấn
    const row = button.closest('tr'); // Tìm hàng <tr> chứa nút đó

    // Lấy dữ liệu từ các ô td trong hàng
    const name = row.querySelector('#courseName').textContent;
    const description = row.querySelector('#courseDescription').textContent;
    const startDate = row.querySelector('#courseStartDate').textContent;
    const endDate = row.querySelector('#courseEndDate').textContent;
    const instructorName = row.querySelector('#courseInstructorName').textContent;
    const tuition = row.querySelector('#courseTuition').textContent;
    const instructorId = row.querySelector('#courseId').value;

    //console.log(name);
    // Cập nhật các trường trong form chỉnh sửa hoặc modal (ví dụ)
    document.getElementById('updateCourseName').value = name;
    document.getElementById('updateCourseDescription').value = description;
    document.getElementById('updateCourseStarDate').value = startDate;
    document.getElementById('updateCourseEndDate').value = endDate;
    document.getElementById('updateCourseTuition').value = tuition;
    document.getElementById('courseId').value = instructorId;

    const idName = 'CourseInstructor';
    findAllInstructor(idName);

}
// Hàm xóa khóa học
function deleteCourse() {

    const confirmDelete = confirm("Bạn có chắc là bạn muốn xóa khóa học này không?");
    if (!confirmDelete) {
        return; // Nếu chọn "Cancel", kết thúc hàm và không thực hiện lệnh xóa
    }

    const button = event.target; // Lấy phần tử nút đã được nhấn
    const row = button.closest('tr'); // Tìm hàng <tr> chứa nút đó
    const id = row.querySelector('#courseId').value;
    const apiUrl = `http://localhost:8099/course/deleteCourse/${id}`;
    fetch(apiUrl, {
        method: 'DELETE', // Sử dụng PUT để cập nhật
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi xóa giảng viên');
            }
            if (response.ok) {
                window.location.reload();
            }

        })
        .catch(error => {
            console.error('Lỗi:', error);
        });
}

async function addCourse() {
    const name = document.getElementById('addCourseName').value;
    const description = document.getElementById('addCourseDescription').value;
    const startDate = document.getElementById('addCourseStartDate').value;
    const endDate = document.getElementById('addCourseEndDate').value;
    const tuition = document.getElementById('addCourseTuition').value;
    const selectedValue = document.getElementById('addCourseInstructor').value;

    if (!name || !startDate || !endDate || !tuition || !selectedValue) {
        alert("Vui lòng điền đầy đủ thông tin (Tên, Ngày bắt đầu, Ngày kết thúc, Học phí, Giảng viên).");
        return; // Ngừng thực hiện nếu thiếu thông tin
    }

    const newCourse = {
        courseName: name,
        description: description,
        instructorId: selectedValue,
        startDate: startDate,
        endDate: endDate,
        tuition: tuition
    };

    const apiUrl = 'http://localhost:8099/course/createCourse';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCourse)
        });

        // Kiểm tra nếu phản hồi là JSON hay text
        let result;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            result = await response.json();
        } else {
            result = await response.text();
        }

        // Xử lý phản hồi dựa trên loại dữ liệu
        if (!response.ok) {
            alert(result.statusMessage || result || "Đã xảy ra lỗi.");
        } else {
            alert(result.statusMessage || "Thành công!");
            window.location.reload();
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert("Không thể kết nối đến máy chủ.");
    }
}



function updateCourse() {
    const id = document.getElementById('courseId').value;
    const name = document.getElementById('updateCourseName').value;
    const description = document.getElementById('updateCourseDescription').value;
    const startDate = document.getElementById('updateCourseStartDate').value;
    const endDate = document.getElementById('updateCourseEndDate').value;
    const tuition = document.getElementById('updateCourseTuition').value;
    const selectElement = document.getElementById('CourseInstructor');
    const selectedValue = selectElement.value;

    if (!name || !startDate || !endDate || !tuition || !selectedValue) {
        alert("Vui lòng điền đầy đủ thông tin (Tên, Ngày bắt đầu, Ngày kết thúc, Học phí, Giảng viên).");
        return; // Ngừng thực hiện nếu thiếu thông tin
    }

    // Dữ liệu cần cập nhật
    const update = {
        courseName: name,
        description: description,
        instructorId: selectedValue,
        startDate: startDate,
        endDate: endDate,
        tuition: tuition
    };

    // URL API
    const apiUrl = `http://localhost:8099/course/updateCourse/${id}`;

    fetch(apiUrl, {
        method: 'PUT', // Sử dụng PUT để cập nhật
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(update), // Chuyển đổi dữ liệu thành JSON
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi cập nhật khóa học');
            }
            return response.json(); // Chuyển đổi phản hồi sang JSON
        })
        .then(data => {
            if (data.statusMessage) {
                // Nếu có statusMessage, hiển thị thông báo
                alert(data.statusMessage); // Hiển thị thông báo
                window.location.reload(); // Tải lại trang sau khi cập nhật
            }
        })
        .catch(error => {
            console.error('Lỗi:', error);
            alert("Có lỗi khi cập nhật khóa học, vui lòng thử lại.");
        });
}


document.addEventListener("DOMContentLoaded", function () {
    // Lấy các phần tử input và button
    const searchInput = document.getElementById("findCourse");

    // Kiểm tra xem các phần tử có tồn tại trước khi gán sự kiện
    if (searchInput) {
        // Sự kiện nhấn Enter trên ô input
        searchInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                e.preventDefault(); // Ngăn form submit nếu có
                const query = searchInput.value;
                findCourse(query); // Gọi hàm tìm kiếm
            }
        });
    }
});


// function findCourse() {
//     const key = document.getElementById("findCourse").value;
//     const apiUrl = `http://localhost:8099/course/findCourses/${key}`;
//     fetch(apiUrl, {
//         method: 'GET', // Sử dụng PUT để cập nhật
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Lỗi khi cập nhật giảng viên');
//             }
//             return response.json(); // Chuyển đổi phản hồi sang JSON
//         })
//         .then(data => {
//             const instructorList = document.querySelector('.instructors-table tbody');
//             instructorList.innerHTML = ''; // Xóa nội dung cũ
//
//             data.forEach(instructor => {
//                 const row = document.createElement('tr');
//                 row.innerHTML = `
//                     <td id="instructName">${instructor.Name}</td>
//                     <td id="instructEmail">${instructor.Email}</td>
//                     <td id="instructPhone">${instructor.Phone}</td>
//                     <td id="instructExpertise">${instructor.Expertise}</td>
//                     <td>
//                     <input type="hidden" name="instructorId" id="instructorId" value="${instructor.InstructorID}">
//                         <div class="action-buttons">
//                             <button class="btn-icon btn-edit" onclick="showModalInstructor('editInstructorModal',event)">✎</button>
//                             <button class="btn-icon btn-delete" onclick="deleteInstructor(event)">×</button>
//                         </div>
//                     </td>
//                 `;
//                 instructorList.appendChild(row); // Thêm row vào tbody
//             });
//         })
//         .catch(error => {
//             console.error('Lỗi:', error);
//         });
// }

async function findCourse() {
    const key = document.getElementById("findCourse").value;
    const apiUrl = `http://localhost:8099/course/findCourses/${key}`;
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error('Lỗi khi gọi API');
        }
        const data = await response.json();
        const courseList = document.querySelector('.course-table tbody');
        courseList.innerHTML = ''; // Xóa nội dung cũ

        for (const course of data) {
            const instructorName = await findInstructorById(course.InstructorID);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td id="courseName">${course.CourseName}</td>
                <td id="courseDescription">${course.Description}</td>
                <td id="courseStartDate">${course.StartDate}</td>
                <td id="courseEndDate">${course.EndDate}</td>
                <td id="courseTuition">${course.Tuition}</td>
                <td id="courseStatus">${course.Status}</td>
                <td id="courseInstructorName">${instructorName}</td>
                <td>
                    <input type="hidden" name="courseId" id="courseId" value="${course.CourseID}">
                    <div class="action-buttons">
                        <button class="btn-icon btn-edit" onclick="showModalCourse('editCourseModal',event)">✎</button>
                        <button class="btn-icon btn-delete" onclick="deleteCourse(event)">×</button>
                    </div>
                </td>
            `;
            courseList.appendChild(row); // Thêm row vào tbody
        }
    } catch (error) {
        console.error('Lỗi:', error);
    }
}





