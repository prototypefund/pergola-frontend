// Import Icons and App Custom Styles
import '../src/css/icons.css'
import '../src/css/app.scss'
import dayjs from "dayjs";
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/de'
import 'dayjs/locale/en'
import weekday from "dayjs/plugin/weekday";



dayjs.extend(localizedFormat)
dayjs.extend( weekday )


// Import App Component

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}
