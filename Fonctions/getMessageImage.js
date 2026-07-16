const messageHasImage = (msg) => {
	if (!msg) return false
	if (msg.attachments?.size > 0) {
		for (const [, att] of msg.attachments) {
			const contentType = att.contentType?.toLowerCase() || ""
			if (contentType.startsWith("image/") || /\.(png|jpe?g|gif|webp|bmp|tiff?)(\?.*)?$/i.test(att.name || "")) {
				return true
			}
		}
	}
	if (msg.embeds?.length > 0) {
		for (const emb of msg.embeds) {
			if (emb.image?.url || emb.thumbnail?.url) return true
		}
	}
	return false
}

const getFirstImage = (msg) => {
	if (!msg) return null
	if (msg.attachments?.size > 0) {
		for (const [, att] of msg.attachments) {
			const contentType = att.contentType?.toLowerCase() || ""
			if (contentType.startsWith("image/") || /\.(png|jpe?g|gif|webp|bmp|tiff?)(\?.*)?$/i.test(att.name || "")) {
				return att.proxyURL || att.url
			}
		}
	}
	if (msg.embeds?.length > 0) {
		for (const emb of msg.embeds) {
			if (emb.image?.url) return emb.image.url
			if (emb.thumbnail?.url) return emb.thumbnail.url
		}
	}
}

module.exports = {messageHasImage, getFirstImage}
