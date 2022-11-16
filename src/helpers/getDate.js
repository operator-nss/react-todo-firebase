import dayjs from "dayjs";

export const getDate = (date) => {
	return dayjs.unix(date).format('DD.MM.YYYY')
}
