const filterKhoaHocTheoDanhMuc = (danhMucKhoaHoc, danhSachKhoaHoc) => {
    let khoaHocTheoDanhMuc = danhMucKhoaHoc.map((danhMuc) => {
        return {
            tenDanhMuc: danhMuc.tenDanhMuc,
            khoaHocDanhMuc: danhSachKhoaHoc.filter((khoaHoc) => {
                return khoaHoc.danhMucKhoaHoc_ID.tenDanhMuc === danhMuc.tenDanhMuc;
            }),
        };
    });

    khoaHocTheoDanhMuc = khoaHocTheoDanhMuc.filter((item) => item.khoaHocDanhMuc.length > 0);
    return khoaHocTheoDanhMuc
};

module.exports = filterKhoaHocTheoDanhMuc
