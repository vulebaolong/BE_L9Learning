const filterCoursesByCategory = (courseCategories, courseList) => {
    let coursesByCategory = courseCategories.map((category) => {
        return {
            categoryName: category.categoryName,
            coursesInCategory: courseList.filter((course) => {
                return course.courseCategory_ID.categoryName === category.categoryName;
            }),
        };
    });

    coursesByCategory = coursesByCategory.filter((item) => item.coursesInCategory.length > 0);
    return coursesByCategory
};

module.exports = filterCoursesByCategory
