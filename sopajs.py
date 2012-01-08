import os
import webapp2
from google.appengine.api import memcache
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext.webapp import template
import pygeoip

import jinja2
jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    autoescape=True)

# Little helper for creating static pages
def create_page(template_file):
    class klass(webapp2.RequestHandler):
        template = jinja_environment.get_template(
            os.path.join('templates', template_file))
        def get(self): self.response.out.write(self.template.render({
            'current_page': self.request.path
        }))
    return klass
MainPage = create_page('index.html')
UsePage  = create_page('use.html')
FAQPage  = create_page('faq.html')

class SOPAJS(webapp2.RequestHandler):
    template = jinja_environment.get_template(
        os.path.join('templates', 'sopa.js'))
    default_type = 'politics'
    alternative_default_type = 'media'
    def get(self):
        _type = None
        if not self.request.GET.get('type'):
            _type = self.default_type

        info = lookup_ip(self.request)
        if _type=='politics' and not info:
            _type=self.alternative_default_type
        template_values = {
            'bg_color': '#fff',
            'type': _type,
            'state': info.get('region_name') if info else None,
        }
        self.response.out.write(self.template.render(template_values))



############# UTILITIES ################

GEOIP = pygeoip.GeoIP('data/GeoLiteCity.dat', flags=pygeoip.const.MEMORY_CACHE)
def lookup_ip(request):
    data = memcache.get(request.remote_addr)
    if data is not None:
        return data
    else:
        info = GEOIP.record_by_addr('67.169.29.180') #request.remote_addr)
        if info and (not info.get('country_code')=="US" or not info.get('region_name')):
            info = None
        memcache.add(request.remote_addr, info, 3600)
        return info


############# APPLICATION ##############
application = webapp2.WSGIApplication(
    [
        ('/', MainPage),
        ('/use', UsePage),
        ('/faq', FAQPage),
        ('/sopa.js', SOPAJS),
    ],
    debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
