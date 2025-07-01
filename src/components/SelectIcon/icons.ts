const modules = import.meta.glob('../../assets/icon/*.svg', { eager: true })
export default Object.keys(modules).map(path => path.match(/\/([^/]+)\.svg$/)![1])