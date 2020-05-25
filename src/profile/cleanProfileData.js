const logger = require('../logger')(__filename)
const pkg = require('../package')

module.exports = (profile) => {
  profile.profile = profile.profileLegacy
  if(!profile.profile){
    profile.profile = profile.profileAlternative
  }

  if(!profile.profile) {
    const messageError = `LinkedIn website changed and ${pkg.name} ${pkg.version} can't read basic data. Please report this issue at ${pkg.bugs.url}`
    logger.error(messageError, '')
    throw new Error(messageError)
  }

  //backward compatibility only
  if(profile.aboutLegacy && profile.aboutLegacy.text) {
    profile.profile.summary = profile.aboutLegacy.text
  }
  if(profile.aboutAlternative && profile.aboutAlternative.text) {
    profile.profile.summary = profile.aboutAlternative.text
  }

  profile.positions.forEach((position) => {
    if(position.title){
        position.title = position.title.replace('Company Name\n', '')
    }
    if(position.description) {
      position.description = position.description.replace('See more', '');
      position.description = position.description.replace('see more', '');
	    position.description = position.description.replace('See less', '');
    }
    if(position.roles) {
      position.roles.forEach((role) => {
        if(role.title) {
          role.title = role.title.replace('Title\n', '')
        }
        if(role.description) {
          role.description = role.description.replace('See more', '')
          role.description = role.description.replace('see more', '')
        }
      })
    }
  })

  return profile
}
