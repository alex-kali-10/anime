from bs4 import BeautifulSoup
from urllib.request import urlopen, Request
import time

f = open('text.txt', 'w')

for i in range(161):
    print(i)
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.3'}
    reg_url = 'https://yummyanime.club/catalog?page='+str(i+1)
    req = Request(url=reg_url, headers=headers)
    page = urlopen(req).read()
    soup = BeautifulSoup(page)
    list = soup.find_all('a', {'class': 'image-block'})
    for i in list:
        href = i.get('href')
        f.write('https://yummyanime.club'+href + '\n')
    #print(list)
    time.sleep(10)


f.close()


