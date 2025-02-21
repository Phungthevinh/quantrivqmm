let currentPage = 1;
const limit = 10;
let totalPages = 1;

async function fetchTotalPages() {
    const sumCode = document.querySelector('.sumCode')
    const response = await fetch('https://vvmm.onrender.com/countDelete');
    const data = await response.json();
    totalPages = Math.ceil(data.total / limit);
    sumCode.innerHTML = `Tổng: ${data.total} mã đã quay`
    renderPagination();
}

async function fetchUsers(page) {
    const response = await fetch(`https://vvmm.onrender.com/?page=${page}&limit=${limit}`);
    const data = await response.json();
    renderTable(data);
}

function renderTable(data) {
    const tableBody = document.getElementById('userTable');
    tableBody.innerHTML = '';

    data.forEach((item, index) => {
        const row = `
            <tr>
                <th scope="row">${index + 1}</th>
                <td>${item.code}</td>
                <td>${item.quay ? "Đã quay" : "Chưa quay"}</td>
                <td>${item.deleteAt ? "Đã xóa" : "Còn hiệu lực"}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function renderPagination() {
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';

    // Nút Previous
    pagination.innerHTML += `
        <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <a class="page-link" href="javascript:void(0);" onclick="changePage(${currentPage - 1})">Previous</a>
        </li>
    `;

    const pages = [];
    if (totalPages <= 7) {
        // Hiển thị tất cả nếu totalPages ít (dưới 7)
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        // Hiển thị số trang với dấu "..."
        pages.push(1); // Trang đầu
        if (currentPage > 3) pages.push('...');

        const start = Math.max(2, currentPage - 1);
        console.log(start)
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) pages.push(i);

        if (currentPage < totalPages - 2) pages.push('...');
        pages.push(totalPages); // Trang cuối
    }
    console.log(pages)

    pages.forEach(page => {
        if (page === '...') {
            pagination.innerHTML += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
        } else {
            pagination.innerHTML += `
                <li class="page-item ${page === currentPage ? "active" : ""}">
                    <a class="page-link" href="javascript:void(0);" onclick="changePage(${page})">${page}</a>
                </li>
            `;
        }
    });

    // Nút Next
    pagination.innerHTML += `
        <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
            <a class="page-link" href="javascript:void(0);" onclick="changePage(${currentPage + 1})">Next</a>
        </li>
    `;
}


function changePage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    fetchUsers(currentPage);
    renderPagination();
}

// Gọi API lần đầu khi tải trang
fetchTotalPages().then(() => fetchUsers(currentPage));
