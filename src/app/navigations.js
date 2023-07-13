export const navigations = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Thống kê sản phẩm', path: '/analytic/products', icon: 'analytics' },
    { name: 'Thống kê đơn hàng', path: '/analytic/orders', icon: 'analytics' },
    { name: 'Thống kê blog', path: '/analytic/blogs', icon: 'analytics' },
    { label: 'Quản lý', type: 'label' },
    {
        name: 'Món ăn',
        icon: 'fastfood',
        path: '/product/manage'
    },
    {
        name: 'Đơn hàng',
        icon: 'receipt',
        path: '/order/manage',
    },
    {
        name: 'Blog',
        icon: 'receipt',
        path: '/blog/manage'
    },
    {
        name: 'Khách hàng',
        icon: 'person',
        path: '/customer/manage'
    },
    {
        name: 'Nhân viên',
        icon: 'support_agent',
        path: '/staff/manage'
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
