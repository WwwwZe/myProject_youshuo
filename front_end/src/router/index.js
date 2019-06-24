import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from "@/components/Welcome"
import Users from '@/components/Users'
import Managers from '@/components/Managers'
import Articles from '@/components/Articles'
import Articletypes from '@/components/Articletypes'
import Comments from '@/components/Comments'
import Slides from '@/components/Slides'
import Setting from '@/components/Setting'
import Navmenu from '@/components/Navmenu'
import Questions from '@/components/Questions'
import Answers from '@/components/Answers'
import Personal from '@/components/Personal'
import Password from '@/components/Password'

Vue.use(Router)
const router = new Router({
  routes: [{
      path: '/',
      redirect: "/home"
    },
    {
      path: "/login",
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: "/welcome",
      children: [{
          path: "/welcome",
          component: Welcome
        },
        {
          path: "/users",
          component: Users
        },
        {
          path: "/managers",
          component: Managers
        },
        {
          path: "/articles",
          component: Articles
        },
        {
          path: "/articletypes",
          component: Articletypes
        },
        {
          path: "/comments",
          component: Comments
        },
        {
          path: "/slides",
          component: Slides
        },
        {
          path: "/settings",
          component: Setting
        },
        {
          path: "/navmenu",
          component: Navmenu
        },
        {
          path: "/questions",
          component: Questions
        },
        {
          path: "/answers",
          component: Answers
        },
        {
          path: "/personal",
          component: Personal
        },
        {
          path: "/password",
          component: Password
        }
      ]
    },
  ]
})

router.beforeEach((to,from,next)=>{
  const token=window.sessionStorage.getItem("token")
  if(token===null && to.path!=="/login") {
    return next("/login")
  }
  next()
})

export default router
