import React from 'react'
import Icon from '../Icon'

interface ShareIconProps {
  className?: string | undefined
}

const ShareIcon: React.FC<ShareIconProps> = ({ className }) => {
  return <Icon name="share-icon" size={28} label="Share" className={className} />
}

export default ShareIcon 