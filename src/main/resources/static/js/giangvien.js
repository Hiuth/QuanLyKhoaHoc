function fetchAllInstructors() {
    const apiUrl = 'http://localhost:8099/instructor/allInstructor';
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi gọi API');
            }
            return response.json();
        })
        .then(data => {
            const instructorList = document.querySelector('.instructors-table tbody');
            instructorList.innerHTML = ''; // Xóa nội dung cũ

            data.forEach(instructor => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td id="instructName">${instructor.Name}</td>
                    <td id="instructEmail">${instructor.Email}</td>
                    <td id="instructPhone">${instructor.Phone}</td>
                    <td id="instructExpertise">${instructor.Expertise}</td>
                    <td>
                    <input type="hidden" name="instructorId" id="instructorId" value="${instructor.InstructorID}">
                        <div class="action-buttons">
                            <button class="btn-icon btn-edit" onclick="showModal('editInstructorModal')">✎</button>
                            <button class="btn-icon btn-delete">×</button>
                        </div>
                    </td>
                `;
                instructorList.appendChild(row); // Thêm row vào tbody
            });
        })
        .catch(error => {
            console.error('Lỗi:', error);
        });
}

document.addEventListener("DOMContentLoaded", function() {
    // Lấy tất cả các nút chỉnh sửa
    const editButtons = document.querySelectorAll('.btn-edit');

    // Duyệt qua tất cả các nút và gán sự kiện click
    editButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            editInstructor(button);
        });
    });

    // Lấy tất cả các nút xóa
    const deleteButtons = document.querySelectorAll('.btn-delete');

    // Duyệt qua tất cả các nút và gán sự kiện click
    deleteButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            deleteInstructor(button);
        });
    });
});

// Hàm chỉnh sửa giảng viên
function editInstructor(button) {
    // Lấy hàng (tr) chứa nút chỉnh sửa
    const row = button.closest('tr');

    // Lấy dữ liệu từ các ô td trong hàng
    const name = row.querySelector('#instructName').textContent;
    const email = row.querySelector('#instructEmail').textContent;
    const phone = row.querySelector('#instructPhone').textContent;
    const expertise = row.querySelector('#instructExpertise').textContent;
    const instructorId = row.querySelector('#instructorId').value;

    // Hiển thị thông tin giảng viên trong form chỉnh sửa (hoặc xử lý theo yêu cầu)
    console.log(`Giảng viên: ${name}, Email: ${email}, Số điện thoại: ${phone}, Chuyên môn: ${expertise}, ID: ${instructorId}`);

    // Cập nhật các trường trong form chỉnh sửa hoặc modal (ví dụ)
    document.getElementById('editInstructorName').value = name;
    document.getElementById('editInstructorEmail').value = email;
    document.getElementById('editInstructorPhone').value = phone;
    document.getElementById('editInstructorExpertise').value = expertise;
    document.getElementById('editInstructorId').value = instructorId;

    // Mở modal chỉnh sửa (ví dụ)
    showModal('editInstructorModal');
}

// Hàm xóa giảng viên
function deleteInstructor(button) {
    // Lấy hàng (tr) chứa nút xóa
    const row = button.closest('tr');

    // Lấy ID của giảng viên từ ô hidden
    const instructorId = row.querySelector('#instructorId').value;

    // Thực hiện xóa giảng viên (ví dụ: gửi yêu cầu API để xóa giảng viên)
    console.log(`Xóa giảng viên có ID: ${instructorId}`);

    // Bạn có thể thêm xác nhận trước khi xóa hoặc gửi yêu cầu API để xóa
}



function updateInstructor() {
    const id = document.getElementById("instructorId").value;
    const Name = document.getElementById("instructorName").value;
    const Email = document.getElementById("instructorEmail").value;
    const Phone = document.getElementById("instructorPhone").value;
    const Expertise = document.getElementById("instructorExpertise").value;
    const update = {
        Name: Name,
        Email: Email,
        Phone: Phone,
        Expertise: Expertise,
    }
    console.log(id);
    const apiUrl = `http://localhost:8099/instructor/updateInstructor/${id}`;
    fetch(apiUrl, {
        method: 'PUT', // Sử dụng PUT để cập nhật
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(update), // Chuyển đổi dữ liệu thành JSON
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi cập nhật giảng viên');
            }
            return response.json(); // Chuyển đổi phản hồi sang JSON
        })
        .then(data => {
            console.log('Giảng viên đã được cập nhật:', data);
            // Làm gì đó sau khi cập nhật thành công (ví dụ: cập nhật giao diện)
        })
        .catch(error => {
            console.error('Lỗi:', error);
        });
}





