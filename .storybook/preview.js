// Import Icons and App Custom Styles
import '../src/css/icons.css'
import '../src/css/app.scss'
import dayjs from "dayjs";
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/de'
import 'dayjs/locale/en'



dayjs.extend(localizedFormat)


// Import App Component

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}
