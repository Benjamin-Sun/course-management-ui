import axios from "axios";
import dayjs from "dayjs";

const API_URL =
  import.meta.env === "development" ? "/api" : "http://127.0.0.1:9800";

export default {

  getStudentByName(studentName) {
    return axios.get(
      `${API_URL}/courseManage/student/getStudentByName?studentName=${studentName}`
    );
  },

  getAllStudents() {
    return axios.get(`${API_URL}/courseManage/student/getAllStudents`);
  },

  addStudent(data) {
    return axios.post(`${API_URL}/courseManage/student/addStudent`, data);
  },

  removeStudent(studentName) {
    return axios.get(
      `${API_URL}/courseManage/student/removeStudent?studentName=${studentName}`
    );
  },

  getAllCourses(data) {
    return axios.post(`${API_URL}/courseManage/schedule/getAllCoursesByStudentName`, data);
  },

  removeCourse(courseIdList) {
    return axios.post(
      `${API_URL}/courseManage/course/removeCourse`, courseIdList);
  },

  addSchedule(data) {
    return axios.post(`${API_URL}/courseManage/schedule/addSchedule`, data);
  },

  addCourseNote(data) {
    return axios.post(`${API_URL}/courseManage/course/addCourseNote`, data);
  },

  getCourseById(courseId) {
    return axios.get(
      `${API_URL}/courseManage/course/getCourseById?courseId=${courseId}`
    );
  },

  updateCourseStatus(data) {
    return axios.post(
      `${API_URL}/courseManage/course/updateCourseStatus`, data);
  },

  reScheduleCourse(params) {
    return axios.get(`${API_URL}/courseManage/course/rescheduleCourse?courseId=${params.courseId}&newTime=${params.newTime}`);
  },

  getTotalFeeForToday() {
    return axios.get(
      `${API_URL}/courseManage/course/getTotalFeeForToday`);
  },

  getAllStudentCourseAndTime(date) {
  //   let data = [
  //     {
  //       studentName: "test2",
  //       courseId: 36,
  //       courseStatus: 0,
  //       scheduleTime: "2025-02-22T15:00:00",
  //     },
  //     {
  //       studentName: "test2",
  //       courseId: 32,
  //       courseStatus: 0,
  //       scheduleTime: "2025-02-24T22:19:26",
  //     },
  //     {
  //       studentName: "test2",
  //       courseId: 322,
  //       courseStatus: 0,
  //       scheduleTime: "2025-02-24T12:19:26",
  //     },
  //   ];
    //
    /**
     * 按日期转换为 Map
     *  {
          "2025-02-22": [ ],
          "2025-02-24": [ ]
        }
     */
    // return data.reduce((acc, item) => {
    //   const date = dayjs(item.scheduleTime).format("YYYY-MM-DD")
    //   if (!acc[date]) {
    //     acc[date] = [];
    //   }
    //   acc[date].push(item);
    //   return acc;
    // }, {});

    return axios
      .get(
        `${API_URL}/courseManage/schedule/getAllStudentCourseAndTimeByMonth?date=${date}`
      )
      .then(({ data }) => {
        return data.reduce((acc, item) => {
          const date = dayjs(item.scheduleTime).format("YYYY-MM-DD");
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(item);
          return acc;
        }, {});
      });
  },
};
