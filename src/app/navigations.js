export const navigations = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { label: 'Quản lý', type: 'label' },
    {
        name: 'Món ăn',
        icon: 'fastfood',
        path: '/product/manage'
    },
    {
        name: 'Đơn hàng',
        icon: 'receipt',
        children: [
            { name: 'Danh sách các đơn', iconText: 'OI', path: '/order/manage', },
            { name: 'Viết đơn hàng', iconText: 'WO', path: '/order/add' },
        ],
    },
    {
        name: 'Blog',
        icon: 'feed',
        children: [
            { name: 'Danh sách blog', iconText: 'BI', path: '/blog/manage' },
            { name: 'Báo cáo', iconText: 'RB', path: '/blog/report' },
        ],
    },
    {
        name: 'Khách hàng',
        icon: 'person',
        children: [
            { name: 'Danh sách khách hàng', iconText: 'CI', path: '/customer/manage' },
            { name: 'Báo cáo', iconText: 'RU', path: '/customer/report' },
        ],
    },
    {
        name: 'Nhân viên',
        icon: 'support_agent',
        children: [
            { name: 'Danh sách nhân viên', iconText: 'SI', path: '/staff/manage' },
            { name: 'Nhân viên mới', iconText: 'NS', path: '/staff/add' },
        ],
    },
    { label: 'Apps', type: 'label' },
    {
        name: 'Chat',
        icon: 'chat',
        path: '/chat'
    },
    {
        name: 'Lịch',
        icon: 'CalendarToday',
        path: '/calendar'
    },
];


/* export const navigations = [
    { name: 'Dashboard', path: '/dashboard/default', icon: 'dashboard' },
    { label: 'PAGES', type: 'label' },
    {
      name: 'Session/Auth',
      icon: 'security',
      children: [
        { name: 'Sign in', iconText: 'SI', path: '/session/signin' },
        { name: 'Sign up', iconText: 'SU', path: '/session/signup' },
        { name: 'Forgot Password', iconText: 'FP', path: '/session/forgot-password' },
        { name: 'Error', iconText: '404', path: '/session/404' },
      ],
    },
    { label: 'Components', type: 'label' },
    {
      name: 'Components',
      icon: 'favorite',
      badge: { value: '30+', color: 'secondary' },
      children: [
        { name: 'Auto Complete', path: '/material/autocomplete', iconText: 'A' },
        { name: 'Buttons', path: '/material/buttons', iconText: 'B' },
        { name: 'Checkbox', path: '/material/checkbox', iconText: 'C' },
        { name: 'Dialog', path: '/material/dialog', iconText: 'D' },
        { name: 'Expansion Panel', path: '/material/expansion-panel', iconText: 'E' },
        { name: 'Form', path: '/material/form', iconText: 'F' },
        { name: 'Icons', path: '/material/icons', iconText: 'I' },
        { name: 'Menu', path: '/material/menu', iconText: 'M' },
        { name: 'Progress', path: '/material/progress', iconText: 'P' },
        { name: 'Radio', path: '/material/radio', iconText: 'R' },
        { name: 'Switch', path: '/material/switch', iconText: 'S' },
        { name: 'Slider', path: '/material/slider', iconText: 'S' },
        { name: 'Snackbar', path: '/material/snackbar', iconText: 'S' },
        { name: 'Table', path: '/material/table', iconText: 'T' },
      ],
    },
    {
      name: 'Charts',
      icon: 'trending_up',
      children: [{ name: 'Echarts', path: '/charts/echarts', iconText: 'E' }],
    },
    {
      name: 'Documentation',
      icon: 'launch',
      type: 'extLink',
      path: 'http://demos.ui-lib.com/matx-react-doc/',
    },
  ]; */
