"""Private script handoff to a temporary render job. Only public keys and sealed material leave it."""
import base64,json,os,sys
from pathlib import Path
from cryptography.hazmat.primitives import hashes,serialization
from cryptography.hazmat.primitives.asymmetric import rsa,padding
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
keyfile=Path(os.environ['RUNNER_TEMP'])/'series-session.pem'
if sys.argv[1]=='open':
    key=rsa.generate_private_key(public_exponent=65537,key_size=2048)
    keyfile.write_bytes(key.private_bytes(serialization.Encoding.PEM,serialization.PrivateFormat.PKCS8,serialization.NoEncryption()));keyfile.chmod(0o600)
    Path('public.pem').write_bytes(key.public_key().public_bytes(serialization.Encoding.PEM,serialization.PublicFormat.SubjectPublicKeyInfo))
else:
    key=serialization.load_pem_private_key(keyfile.read_bytes(),None)
    box=json.loads(Path('envelope.json').read_text()); ident=os.environ['LANE'];wrapped=base64.b64decode(box['keys'][ident]);one=key.decrypt(wrapped,padding.OAEP(mgf=padding.MGF1(hashes.SHA256()),algorithm=hashes.SHA256(),label=None))
    enc=base64.b64decode(box['messages'][ident]);Path('input.json').write_bytes(AESGCM(one).decrypt(enc[:12],enc[12:],ident.encode()))
