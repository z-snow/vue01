module.exports = {
    chainWebpack:config=>{
        //发布模式
        config.when(process.env.NODE_ENV === 'production',config=>{
            //entry找到默认的打包入口，调用clear则是删除默认的打包入口
            //add添加新的打包入口
            config.entry('app').clear().add('./src/main_prod.js')
              //使用插件,判断是开发模式还是生产模式
              config.plugin('html').tap(args=>{
                //添加参数isProd
                args[0].isProd = true
                return args
            })

            config.set('externals',{
                 vue:'Vue',
                'vue-router':'VueRouter',
                axios:'axios',
                lodash:'_',
                echarts:'echarts',
                nprogress:'NProgress',
                'vue-quill-editor':'VueQuillEditor'
            })

        })
          //使用externals设置排除项
        


        //开发模式
        config.when(process.env.NODE_ENV === 'development',config=>{
            config.entry('app').clear().add('./src/main_dev.js')

             //使用插件
             config.plugin('html').tap(args=>{
                //添加参数isProd
                args[0].isProd = false
                return args
            })


        })



    }
}