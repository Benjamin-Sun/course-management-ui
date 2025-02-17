import axios from "axios";
import dayjs from "dayjs";


const API_URL = import.meta.env === 'development' ? '/api' : 'http://127.0.0.1:9800'


export default {
  addSchedule(data) {
    return axios.post(`${API_URL}/courseManage/schedule/addSchedule`, data);
  },

  addCourseNote(data) {
    return axios.post(`${API_URL}/courseManage/schedule/addCourseNote`, data);
  },
  updateCourseStatus(){
    return axios.post(`${API_URL}/courseManage/schedule/updateCourseStatus`, data);
  },

  getAllCourse() {
    return [
        {
            "courseId": 1,
            "courseNote": "",
            "courseFee": 300,
            "courseStatus": 0,
            "scheduleTime":"2025-03-07 10:00:00"
        },
        {
            "courseId": 2,
            "courseNote": "",
            "courseFee": 300,
            "courseStatus": 0,
            "scheduleTime":"2025-03-08 10:00:00"
        }
    ].map((c) => ({
        ...c,
        courseTime: dayjs(c.courseTime).format("YYYY-MM-DDTHH:mm:ss"),
    }));
    // return axios
    //   .post(`${API_URL}/courseManage/course/getAllCourse`)
    //   .then(({ data }) => {
    //     return data.map((c) => ({
    //       ...c,
    //       courseTime: dayjs(c.courseTime).format("YYYY-MM-DDTHH:mm:ss"),
    //     }));
    //   });
  },
};
