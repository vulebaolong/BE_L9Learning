const filterKhoaHocTheoDanhMuc = (courseCategory, danhSachKhoaHoc) => {
    let khoaHocTheoDanhMuc = courseCategory.map((danhMuc) => {
        return {
            categoryName: danhMuc.categoryName,
            khoaHocDanhMuc: danhSachKhoaHoc.filter((course) => {
                return course.courseCategory_ID.categoryName === danhMuc.categoryName;
            }),
        };
    });

    khoaHocTheoDanhMuc = khoaHocTheoDanhMuc.filter((item) => item.khoaHocDanhMuc.length > 0);
    return khoaHocTheoDanhMuc
};

module.exports = filterKhoaHocTheoDanhMuc
