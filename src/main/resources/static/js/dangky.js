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
        if (!response.ok) throw new Error('Lỗi khi thêm khóa học');
        console.log("Khóa học đã được thêm thành công");
    } catch (error) {
        console.error('Lỗi:', error);
    }
}

