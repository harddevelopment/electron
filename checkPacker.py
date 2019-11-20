import sys
import pefile
import peutils

signatures = peutils.SignatureDatabase("UserDB.TXT")

def getPackers(path):
	p = pefile.PE(path)
	matches = signatures.match(p, ep_only=True)

	md5 = pefile.md5(path).hexdigest()

	if matches != None:
		return '; '.join(matches)
	else:
		return 'None'

if __name__ == '__main__':
	print(getPackers(sys.argv[1]))
