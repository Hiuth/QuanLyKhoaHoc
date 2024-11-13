async function findStudentById(id) {
    const apiUrl = `http://localhost:8099/student/findStudentById/${id}`;
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

async function findCourseById(id) {
    const apiUrl = `http://localhost:8099/course/findCourseById/${id}`;
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
        return data.CourseName;
    } catch (error) {
        console.error('Lỗi:', error);
        return 'N/A'; // Trả về giá trị mặc định nếu có lỗi
    }
}

async function fetchAllEnrollment() {
    const apiUrl = 'http://localhost:8099/enrollments/get-all';
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
        const courseList = document.querySelector('.enrollments-table tbody');
        courseList.innerHTML = ''; // Xóa nội dung cũ

        for (const enrollment of data) {
            const studentName = await findStudentById(enrollment.StudentID);
            const courseName = await findCourseById(enrollment.CourseID);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td id="enrollmentStudId">${enrollment.StudentID}</td>
                <td id="enrollmentStuName">${studentName}</td>
                <td id="enrollmentCourseId">${enrollment.CourseID}</td>
                <td id="enrollmentCourseName">${courseName}</td>
                <td id="enrollmentDate">${enrollment.EnrollmentDate}</td>
                <td id="enrollmentCourseStatus">${enrollment.CompletionStatus}</td>
                <td>
                <input type="hidden" id="enrollmentId" value="${enrollment.EnrollmentID}" >
                  <div class="action-buttons">
                    <button class="btn-icon btn-delete" onclick="deleteEnrollment(event)">Hủy đăng ký</button>
                  </div>
                </td>
            `;
            courseList.appendChild(row); // Thêm row vào tbody
        }
    } catch (error) {
        console.error('Lỗi:', error);
    }
}

function deleteEnrollment() {
    const confirmDelete = confirm("Bạn có chắc là bạn muốn xóa khóa học này không?");
    if (!confirmDelete) {
        return; // Nếu chọn "Cancel", kết thúc hàm và không thực hiện lệnh xóa
    }
    const button = event.target; // Lấy phần tử nút đã được nhấn
    const row = button.closest('tr'); // Tìm hàng <tr> chứa nút đó
    const StudentId = row.querySelector('#enrollmentStudId').textContent;
    const CourseId = row.querySelector('#enrollmentCourseId').textContent;
    const course ={
        studentId: StudentId,
        courseId: CourseId
    }
    console.log(course);
    const apiUrl = `http://localhost:8099/enrollments/delete`;
    fetch(apiUrl, {
        method: 'POST', // Sử dụng PUT để cập nhật
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(course)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi xóa giảng viên');
            }
            if (response.ok){
                window.location.reload();
            }
            //return response.json(); // Chuyển đổi phản hồi sang JSON
        })
        .catch(error => {
            console.error('Lỗi:', error);
        });
}

async function findAllCourse() {
    const apiUrl = `http://localhost:8099/course/allCourses`;
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
        const selectElement = document.getElementById('courseList');
        selectElement.innerHTML = ''; // Xóa các tùy chọn cũ

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Chọn khóa học';
        selectElement.appendChild(defaultOption);

        data.forEach(course => {
            const option = document.createElement('option');
            option.value = course.CourseID;
            option.textContent = course.CourseName; // hoặc tên trường dữ liệu phù hợp
            selectElement.appendChild(option);
        });

    } catch (error) {
        console.error('Lỗi:', error);
    }
}


async function findStudentByEmail(id) {
    //console.log(id);
    const apiUrl = `http://localhost:8099/student/findStudentByEmail/${id}`;
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
        return data.StudentID;
    } catch (error) {
        console.error('Lỗi:', error);
        return 'N/A'; // Trả về giá trị mặc định nếu có lỗi
    }
}

async function addEnrollment() {
    //event.preventDefault();
    const email = document.getElementById('addEnrollmentEmail').value;
    const StudentId = await findStudentByEmail(email);
    console.log(StudentId);
    const selectElement = document.getElementById('courseList');
    const selectedValue = selectElement.value;

    if (!email || !selectedValue) {
        alert("Vui lòng điền đầy đủ thông tin (Email, Lớp học).");
        return false; // Ngừng thực hiện nếu thiếu thông tin
    }

    if (StudentId == "N/A"){
        alert("Email bạn sử dụng chưa được đăng ký trong hệ thống");
        return false; // Ngừng thực hiện nếu thiếu thông tin
    }

    const newCourse = {
        studentId: StudentId,
        courseId: selectedValue
    };
    const apiUrl = 'http://localhost:8099/enrollments/create';
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
            alert(result.statusMessage || result || "Có vẻ như Email của bạn chưa được đăng kí.");
        } else {
            alert(result.statusMessage || "Thành công!");
            window.location.reload();
        }
    } catch (error) {
        console.error('Lỗi:', error);
    }
}


document.addEventListener("DOMContentLoaded", function () {
    // Lấy các phần tử input và button
    const searchInput = document.getElementById("findEnrollments");

    // Kiểm tra xem các phần tử có tồn tại trước khi gán sự kiện
    if (searchInput) {
        // Sự kiện nhấn Enter trên ô input
        searchInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                e.preventDefault(); // Ngăn form submit nếu có
                const query = searchInput.value;
                findEnrollments(query); // Gọi hàm tìm kiếm
            }
        });
    }
});



async function findEnrollments() {
    const key = document.getElementById("findEnrollments").value;
    const apiUrl = `http://localhost:8099/enrollments/findStudentAndCourse/${key}`;
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
        const courseList = document.querySelector('.enrollments-table tbody');
        courseList.innerHTML = ''; // Xóa nội dung cũ

        for (const enrollment of data) {
            const studentName = await findStudentById(enrollment.StudentID);
            const courseName = await findCourseById(enrollment.CourseID);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td id="enrollmentStudId">${enrollment.StudentID}</td>
                <td id="enrollmentStuName">${studentName}</td>
                <td id="enrollmentCourseId">${enrollment.CourseID}</td>
                <td id="enrollmentCourseName">${courseName}</td>
                <td id="enrollmentDate">${enrollment.EnrollmentDate}</td>
                <td id="enrollmentCourseStatus">${enrollment.CompletionStatus}</td>
                <td>
                <input type="hidden" id="enrollmentId" value="${enrollment.EnrollmentID}" >
                  <div class="action-buttons">
                    <button class="btn-icon btn-delete" onclick="deleteEnrollment(event)">Hủy đăng ký</button>
                  </div>
                </td>
            `;
            courseList.appendChild(row); // Thêm row vào tbody
        }
    } catch (error) {
        console.error('Lỗi:', error);
    }
}


