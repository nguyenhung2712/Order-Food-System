export const navigations = [
    { name: 'Dashboard', path: '/dashboard/default', icon: 'dashboard' },
    { label: 'Quản lý', type: 'label' },
    {
        name: 'Đơn hàng',
        icon: 'receipt',
        path: '/order/manage',
    },
    {
        name: 'Khách hàng',
        icon: 'person',
        path: '/customer/manage'
    },
    {
        name: 'Món ăn',
        icon: 'fastfood',
        children: [
            { name: 'Danh sách món ăn', iconText: 'PL', path: '/product/manage' },
            { name: 'Món ăn mới', iconText: 'NP', path: '/product/add' }
        ],
    },
    {
        name: 'Loại món',
        icon: 'category',
        children: [
            { name: 'Danh sách các loại', iconText: 'CL', path: '/product-type/manage' },
            { name: 'Loại món mới', iconText: 'NC', path: '/product-type/add' }
        ],
    },
    {
        name: 'Blog',
        icon: 'feed',
        children: [
            { name: 'Danh sách blog', iconText: 'BI', path: '/blog/manage' },
            { name: 'Blog mới', iconText: 'NB', path: '/blog/add' },
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
        name: 'Viết hóa đơn',
        icon: 'receipt',
        path: '/receipt'
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
  